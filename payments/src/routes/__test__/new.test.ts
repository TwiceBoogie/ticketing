import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus } from "@twicetickets/common";
import { app } from "../../app";
import { Order } from "../../models/order";
import { stripe } from "../../stripe-client";
import { Payment } from "../../models/payment";

it("creates a payment and saves it to the DB when receiving a fake but valid stripe webook", async () => {
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: orderId,
    userId: "test_user_id",
    version: 0,
    price: 5000,
    status: OrderStatus.Created,
  });
  await order.save();
  // fake event checkout.session.complete
  const fakeEvent = {
    id: "evt_test_id",
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_id",
        metadata: {
          orderId: order.id,
        },
      },
    },
  };

  // test header helper since it needs a stripe signature else it fails
  const body = JSON.stringify(fakeEvent);
  const sig = stripe.webhooks.generateTestHeaderString({
    payload: body,
    secret: process.env.WEBHOOK_KEY!,
  });

  await request(app)
    .post("/api/payments/webhook")
    .set("Stripe-Signature", sig)
    .set("Content-Type", "application/json")
    .send(body)
    .expect(200);

  // assert payment is stored in the db
  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: "cs_test_id",
  });
  expect(payment).not.toBeNull();
});
