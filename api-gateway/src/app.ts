import express, { Express, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { json } from "body-parser";
import { authRouter } from "./routes/authProxy";
const PORT = 3000;

const app: Express = express();
app.set("x-powered-by", false);

app.use(json());
// app.use(urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  console.log(`Also headers: ${req.headers["content-type"]}`);
  next();
});

// const authProxy = createProxyMiddleware({
//   target: "http://auth-srv:3000/api/users",
//   changeOrigin: true,
//   pathRewrite: {
//     "^/api-gateway/currentuser": "/currentuser",
//     "^/api-gateway/signin": "/signin",
//     "^/api-gateway/signout": "/signout",
//     "^/api-gateway/signup": "/signup",
//   },
// });

const orderProxy = createProxyMiddleware({
  target: "http://orders-srv:3000/api/orders",
  changeOrigin: true,
  pathRewrite: {
    "^/api-gateway/orders": "/", // index/get | new/post
    "^/api-gateway/orders/([^/]+)": "/$1", // delete | show
  },
});

const payProxy = createProxyMiddleware({
  target: "http://payments-srv:3000/api/payments",
  changeOrigin: true,
  pathRewrite: {
    "^/api-gateway/payments": "/",
  },
});

const ticketProxy = createProxyMiddleware({
  target: "http://tickets-srv:3000/api/tickets",
  changeOrigin: true,
  pathRewrite: {
    "^/api-gateway/tickets": "/",
    "^/api-gateway/tickets/([^/]+)": "/$1",
  },
});

app.use("/api-gateway/signup", (req, res, next) => {
  const { email, password } = req.body;
  console.log(`request body: ${email}, ${password}`);
  next();
});

app.use(authRouter);

app.listen(PORT, () => {
  console.log(`api-gateway-service is listening to port: ${PORT}`);
});
