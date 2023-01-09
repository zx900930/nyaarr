const server = require('./server');

const { createProxyMiddleware } = require("http-proxy-middleware");
const middlewares = require('./jwt');

server.use(
  "/sonarr",
  ...middlewares,
  createProxyMiddleware({
    target: process.env.SONARR_HOST,
    pathRewrite(path, req) {
      const url = new URL(req.url, `http://${req.headers.host}`);
      url.searchParams.append("apikey", process.env.SONARR_API_KEY);
      if (process.env.SONARR_API_VERSION == 3) {
        url.pathname = url.pathname.replace(/^\/sonarr/, "/api/v3");
      } else {
        url.pathname = url.pathname.replace(/^\/sonarr/, "/api");
      }
      return `${url.pathname}${url.search}`;
    },
    changeOrigin: true,
  })
);
