import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from "@twicetickets/common";

import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";
import mongoose from "mongoose";
import { stripe } from "../stripe-client";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title")
      .not()
      .isEmpty()
      .withMessage("Title cannot be empty if provided"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0 if provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticketId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      throw new NotFoundError();
    }
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError("Cannot edit a reserved ticket");
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    let changed = false;

    if (req.body.title !== ticket.title) {
      await stripe.products.update(ticket.stripeProductId, {
        name: req.body.title,
      });
      ticket.title = req.body.title;
      changed = true;
    }

    if (req.body.price !== ticket.price) {
      await stripe.prices.update(ticket.stripePriceId, {
        active: false,
      });
      const newStripePrice = await stripe.prices.create({
        unit_amount: Math.round(req.body.price * 100),
        currency: "usd",
        product: ticket.stripeProductId,
      });
      ticket.stripePriceId = newStripePrice.id;
      ticket.price = req.body.price;
      changed = true;
    }

    if (changed) {
      await ticket.save();
      await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        stripePriceId: ticket.stripePriceId,
        userId: ticket.userId,
        version: ticket.version,
      });
    }

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
