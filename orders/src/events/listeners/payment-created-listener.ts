import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from "@twicetickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";
import { stripe } from "../../stripe";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    const session = await stripe.checkout.sessions.expire(order.sessionId);

    order.set({
      status: OrderStatus.Complete,
      sessionId: "",
    });
    await order.save();

    msg.ack();
  }
}
