/**
 * Decap CMS GitHub OAuth proxy（自托管，部署为 Netlify Function）
 *
 * Netlify 已废弃旧 OAuth 服务（api.netlify.com/auth 返回 404），
 * 因此自建一个极简的 OAuth 代理，配合 netlify.toml 的 redirects 使用：
 *   /auth      → /.netlify/functions/oauth/auth
 *   /callback  → /.netlify/functions/oauth/callback
 *
 * 需要的环境变量：
 *   GITHUB_OAUTH_CLIENT_ID      GitHub OAuth App 的 Client ID
 *   GITHUB_OAUTH_CLIENT_SECRET  GitHub OAuth App 的 Client Secret
 *   OAUTH_BASE_URL              本站主域（不带路径），如 https://xxx.netlify.app
 *
 * 协议：与 Decap 的 NetlifyAuthenticator 兼容——
 *   popup 打开 {base_url}/auth → 302 到 GitHub 授权页
 *   GitHub 回调 /callback → 验证 state → 用 code 换 token
 *   → 页面通过 window.postMessage 与 Decap 完成握手：
 *     'authorizing:github' → 'authorization:github:success:{"token":"..."}'
 *
 * 安全要点：
 * - state CSRF 防护：/auth 生成密码学随机 state 写入 HttpOnly+Secure+SameSite=Lax cookie，
 *   /callback 比对 URL 中的 state 与 cookie 中的 state 是否一致，不一致直接拒绝
 *   （state 通过 cookie 而非内存存储：Netlify Functions 是 serverless，每次冷启动
 *   会重新初始化，无法用进程内 Map 存 state）
 * - 启动时校验必需环境变量，缺配直接 500 而非 fallback 到错误的 Netlify 占位域名
 */

const CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET;
const BASE_URL = process.env.OAUTH_BASE_URL;
const REDIRECT_URI = BASE_URL ? `${BASE_URL}/callback` : "";

// OAuth state cookie 配置：10 分钟有效（与 GitHub code 有效期一致），仅 HTTPS，
// SameSite=Lax 允许 GitHub 回调后的跨站 GET 携带 cookie（弹窗与主站同源，可放宽）
const STATE_COOKIE = "decap_oauth_state";
const STATE_MAX_AGE = 600;

/** 生成密码学随机 state（256 bit，URL safe hex） */
function generateState() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return hex;
}

/** 从 Cookie 头中提取指定 name 的值，未找到返回 null */
function readCookie(cookieHeader, name) {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

/** 4xx/5xx 响应辅助：附安全头（防 MIME 嗅探 / clickjacking / Referer 泄露） */
function errorResponse(statusCode, message) {
  return {
    statusCode,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      // 禁止 iframe 嵌入，防 clickjacking（Decap 用 window.open 弹窗，不受影响）
      "X-Frame-Options": "DENY",
      // 回调 URL 中的 code / 页面中的 token 不经 Referer 泄露给第三方
      "Referrer-Policy": "no-referrer",
    },
    body: message,
  };
}

exports.handler = async (event) => {
  // 配置检查：缺环境变量直接报错，避免 OAuth 流程跑到一半才发现错配
  if (!CLIENT_ID || !CLIENT_SECRET || !BASE_URL) {
    const missing = [];
    if (!CLIENT_ID) missing.push("GITHUB_OAUTH_CLIENT_ID");
    if (!CLIENT_SECRET) missing.push("GITHUB_OAUTH_CLIENT_SECRET");
    if (!BASE_URL) missing.push("OAUTH_BASE_URL");
    return errorResponse(
      500,
      `OAuth proxy misconfigured: missing ${missing.join(", ")}`
    );
  }

  const path = event.path || "";
  const params = event.queryStringParameters || {};
  const cookies = event.headers?.cookie || event.headers?.Cookie || "";

  // 1) 发起 GitHub 授权：生成 state 并写入 cookie
  if (path.endsWith("/auth")) {
    const state = generateState();
    const qs = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: "repo user:email",
      response_type: "code",
      state,
    });
    return {
      statusCode: 302,
      headers: {
        Location: `https://github.com/login/oauth/authorize?${qs}`,
        // HttpOnly 防 JS 读取；Secure 仅 HTTPS 传输；SameSite=Lax 允许 OAuth 弹窗回调
        "Set-Cookie": `${STATE_COOKIE}=${encodeURIComponent(state)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${STATE_MAX_AGE}`,
        "Cache-Control": "no-store",
        // 防 clickjacking 与 Referer 泄露
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
      },
    };
  }

  // 2) GitHub 回调：先验证 state，再用授权码换取 access token
  if (path.endsWith("/callback")) {
    const code = params.code;
    const state = params.state;
    const savedState = readCookie(cookies, STATE_COOKIE);

    // state 缺失或不匹配 → 拒绝（可能是 CSRF 攻击或过期/重放）
    if (!code || !state || !savedState || state !== savedState) {
      return errorResponse(
        400,
        "Invalid or missing OAuth state parameter (possible CSRF or expired session)"
      );
    }

    let data;
    try {
      const res = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          redirect_uri: REDIRECT_URI,
          state,
        }),
      });
      data = await res.json();
    } catch (err) {
      return errorResponse(502, `Token request failed: ${err.message}`);
    }

    if (!data.access_token) {
      return errorResponse(
        400,
        `OAuth error: ${data.error_description || data.error || "unknown"}`
      );
    }

    // 与 Decap 的 NetlifyAuthenticator 握手
    // 注意：CMS 在 GitHub Pages（linternoka.github.io），而弹窗在本站（Netlify），
    // 跨域时 targetOrigin 必须用 "*"，否则浏览器会丢弃发给 opener 的消息；
    // Decap 侧会自行校验 e.origin === base_url，安全性不受影响。
    const tokenJson = JSON.stringify({ token: data.access_token });
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>授权完成</title></head>
<body>
<script>
(function () {
  function receiveMessage(e) {
    if (e.data === 'authorizing:github') {
      window.opener.postMessage('authorization:github:success:' + ${JSON.stringify(tokenJson)}, '*');
      window.close();
    }
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body>
</html>`;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        // 禁止 iframe 嵌入，防 clickjacking（Decap 用 window.open 弹窗，不受影响）
        "X-Frame-Options": "DENY",
        // 页面内嵌了 access token，绝不允许第三方站点通过 Referer 拿到
        "Referrer-Policy": "no-referrer",
        // 清除 state cookie，防止重放
        "Set-Cookie": `${STATE_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`,
        "Cache-Control": "no-store",
      },
      body: html,
    };
  }

  return errorResponse(404, "Not found");
};