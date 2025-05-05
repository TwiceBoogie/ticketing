import express, { Request, Response, NextFunction } from "express";
import { stripe } from "../stripe-client";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();
const endpointSecret = process.env.WEBHOOK_KEY!;

router.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sig = req.headers["stripe-signature"];

      if (!sig) {
        res.status(400).send({ error: "Missing Stripe signature" });
        return;
      }
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        endpointSecret
      );

      console.log(`Received event: ${event.type}`);

      switch (event.type) {
        case "checkout.session.completed": {
          const checkoutSessionCompleted = event.data.object;

          if (checkoutSessionCompleted.metadata) {
            const order = await Order.findById(
              checkoutSessionCompleted.metadata.orderId
            );

            if (!order) {
              console.error("Order not found for webhook event.");
              res.status(404).send({ error: "Order not found." });
              return;
            }

            const payment = Payment.build({
              orderId: order.id,
              stripeId: checkoutSessionCompleted.id,
            });
            await payment.save();

            await new PaymentCreatedPublisher(natsWrapper.client).publish({
              id: payment.id,
              orderId: payment.orderId,
              stripeId: payment.stripeId,
            });

            console.log("✅ Payment processed successfully.");
          }

          res.status(200).send({ received: true });
          return;
        }

        case "checkout.session.expired":
          console.log("Session expired:", event.data.object);
          res.status(200).send({ message: "Session expired." });
          return;

        case "payment_intent.succeeded":
          console.log("Payment succeeded:", event.data.object);
          res.status(200).send({ message: "Payment succeeded." });
          return;

        case "payment_intent.created":
          console.log(event.data.object);
          res.status(200).send();
          return;
        default:
          console.log(`Unhandled event type: ${event.type}`);
          res
            .status(400)
            .send({ error: `Unhandled event type: ${event.type}` });
          return;
      }
    } catch (err) {
      console.error(
        `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      next(err); // Use Express error handler
    }
  }) as express.RequestHandler
);

export { router as createChargeRouter };
