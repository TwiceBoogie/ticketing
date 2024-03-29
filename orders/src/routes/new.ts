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
import { stripe } from "../stripe";
import { natsWrapper } from "../nats-wrapper";
import Stripe from "stripe";

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

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    // Run query to look at all orders. Find an order where the ticket
    // is the ticket we just found *and* the orders status is *not* cancelled.
    // If we find an order from that means the ticket *is* reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    let checkoutSession: Stripe.Response<Stripe.Checkout.Session>;
    let product: Stripe.Response<Stripe.Product>;
    const session = await mongoose.startSession();
    // Build the order, Product (stripe) and CheckoutSession. If it fails
    // it will abort the transaction. In order to keep consistency.
    try {
      session.startTransaction();

      const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket,
      });
  
      await order.save({session});

      product = await stripe.products.create({
        name: ticket.title,
        default_price_data: {
          unit_amount: ticket.price * 100,
          currency: "usd",
        },
      });
      checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: product.default_price as string, quantity: 1 }],
        success_url: `${process.env.URL!}/checkout/?success=true`,
        cancel_url: `${process.env.URL!}/checkout/?canceled=true`,
        metadata: {
          orderId: order.id,
          productId: product.id
        },
      });

      await session.commitTransaction();
      session.endSession();

      // Publish an event saying that an order was created
      new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        status: order.status,
        userId: order.userId,
        sessionId: checkoutSession.id,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
          id: ticket.id,
          price: ticket.price,
        },
      });
    } catch (error) {
      console.error(error);
      await session.abortTransaction();
      session.endSession();
      await stripe.checkout.sessions.expire(checkoutSession!.id);
      
      throw new BadRequestError("Server Error has occurred");
    }
    
    res.status(201).send({sessionId: checkoutSession.id});
  }
);

export { router as newOrderRouter };
