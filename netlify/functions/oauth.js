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
 *   GitHub 回调 /callback → 用 code 换 token
 *   → 页面通过 window.postMessage 与 Decap 完成握手：
 *     'authorizing:github' → 'authorization:github:success:{"token":"..."}'
 */

const CLIENT_ID = process.env.GITHUB_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_OAUTH_CLIENT_SECRET;
const BASE_URL = process.env.OAUTH_BASE_URL || "https://spontaneous-frangollo-baf0ae.netlify.app";
const REDIRECT_URI = `${BASE_URL}/callback`;

exports.handler = async (event) => {
  const path = event.path || "";
  const params = event.queryStringParameters || {};

  // 1) 发起 GitHub 授权
  if (path.endsWith("/auth")) {
    const qs = new URLSearchParams({
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: "repo user:email",
      response_type: "code",
    });
    return {
      statusCode: 302,
      headers: { Location: `https://github.com/login/oauth/authorize?${qs}` },
    };
  }

  // 2) GitHub 回调：用授权码换取 access token
  if (path.endsWith("/callback")) {
    const code = params.code;
    if (!code) {
      return { statusCode: 400, body: "Missing authorization code" };
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
        }),
      });
      data = await res.json();
    } catch (err) {
      return { statusCode: 502, body: `Token request failed: ${err.message}` };
    }

    if (!data.access_token) {
      return {
        statusCode: 400,
        body: `OAuth error: ${data.error_description || data.error || "unknown"}`,
      };
    }

    // 与 Decap 的 NetlifyAuthenticator 握手
    const tokenJson = JSON.stringify({ token: data.access_token });
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head><meta charset="utf-8"><title>授权完成</title></head>
<body>
<script>
(function () {
  var origin = window.location.origin;
  function receiveMessage(e) {
    if (e.data === 'authorizing:github') {
      window.opener.postMessage('authorization:github:success:' + ${JSON.stringify(tokenJson)}, origin);
      window.close();
    }
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', origin);
})();
</script>
</body>
</html>`;

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
      body: html,
    };
  }

  return { statusCode: 404, body: "Not found" };
};
