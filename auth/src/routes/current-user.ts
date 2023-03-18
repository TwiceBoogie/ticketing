import express from "express";
import { currentUser } from "@twicetickets/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  let tmp = req.session?.jwt;
  console.log(tmp);
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
