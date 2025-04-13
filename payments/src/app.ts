import express, { json } from "express";
import "express-async-errors";

import { currentUser, errorHandler } from "@twicetickets/common";
import { createChargeRouter } from "./routes/new";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

app.use(currentUser);

app.use(createChargeRouter);

app.all("*", async (req, res) => {
  res.redirect(`${process.env.REDIRECT_USER!}`);
});

app.use(errorHandler);

export { app };
