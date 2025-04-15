import express, { Request, Response } from "express";
import { NotFoundError, validateRequest } from "@twicetickets/common";
import { Ticket } from "../models/ticket";
import { param } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
  const ticketId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(ticketId)) {
    throw new NotFoundError();
  }

  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as showTicketRouter };
