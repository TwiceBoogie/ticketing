import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@twicetickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { stripe } from "../../stripe-client";
import Stripe from "stripe";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new Error("Order not found");
    }

    if (
      order.status === OrderStatus.Complete ||
      order.status === OrderStatus.Cancelled
    ) {
      return msg.ack();
    }

    try {
      await stripe.checkout.sessions.expire(order.stripeCheckoutId);
    } catch (error) {
      if (
        error instanceof Stripe.errors.StripeError &&
        error.type === "StripeInvalidRequestError" &&
        typeof error.message === "string" &&
        error.message.includes(
          'Only Checkout Sessions with a status in ["open"]'
        )
      ) {
        console.warn(
          `[Stripe] Session already expired or completed: ${order.stripeCheckoutId}`
        );
      } else {
        throw error;
      }
    }

    order.set({
      status: OrderStatus.Cancelled,
      stripeCheckoutId: undefined,
      stripeCheckoutUrl: undefined,
    });
    await order.save();
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack();
  }
}
