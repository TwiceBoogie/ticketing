import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler } from "@twicetickets/common";
import { createChargeRouter } from "./routes/new";

const app = express();
app.set("trust proxy", true);

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

app.use(createChargeRouter);

app.all("*", async (req, res) => {
  res.redirect("http://localhost:3000");
});

app.use(errorHandler);

export { app };
