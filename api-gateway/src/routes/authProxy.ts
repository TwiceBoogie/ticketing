import express, { Router, Response, Request } from "express";
import { createProxyMiddleware, RequestHandler } from "http-proxy-middleware";
import queryString from "node:querystring";

const router: Router = express.Router();

const authProxy: RequestHandler = createProxyMiddleware({
  target: "http://auth-srv:3000/api/users",
  changeOrigin: true,
  pathRewrite: {
    "^/api-gateway/currentuser": "/currentuser",
    "^/api-gateway/signin": "/signin",
    "^/api-gateway/signout": "/signout",
    "^/api-gateway/signup": "/signup",
  },
  onProxyReq: async (proxyReq, req, res) => {
    if (!req.body || !Object.keys(req.body).length) {
      return;
    }

    const contentType = proxyReq.getHeader("Content-Type");
    const writeBody = (bodyData: string) => {
      proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    };

    if (contentType === "application/json") {
      writeBody(JSON.stringify(req.body));
    }

    if (contentType === "application/x-www-form-urlencoded") {
      writeBody(queryString.stringify(req.body));
    }
  },
});

router.get("/api-gateway/currentuser", authProxy);
router.post("/api-gateway/signup", authProxy);
router.post("/api-gateway/signin", authProxy);
router.post("/api-gateway/signout", authProxy);

export { router as authRouter };
