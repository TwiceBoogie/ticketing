import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@twicetickets/common";

import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";
import { stripe } from "../stripe-client";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const stripeProduct = await stripe.products.create({
      name: title,
    });

    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(price * 100),
      currency: "usd",
      product: stripeProduct.id,
    });

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
    });
    await ticket.save();

    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      stripePriceId: stripePrice.id,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
