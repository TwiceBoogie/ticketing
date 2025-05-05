import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from "@twicetickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { stripe } from "../stripe-client";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    console.log(ticketId);
    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    const orderId = new mongoose.Types.ObjectId().toHexString();

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: ticket.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        orderId: orderId,
      },
      mode: "payment",
      success_url: `${process.env.SUCCESS_URL}/orders?status=success`,
      cancel_url: `${process.env.CANCEL_URL}/orders?status=canceled`,
    });

    // Build the order and save it to the database
    const order = Order.build({
      id: orderId,
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      stripeCheckoutId: checkoutSession.id,
      stripeCheckoutUrl: checkoutSession.url!,
      ticket,
    });

    await order.save();

    // Publish an event saying that an order was created
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
