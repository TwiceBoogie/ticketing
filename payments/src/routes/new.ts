import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from "@twicetickets/common";
import { stripe } from "../stripe";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();
const endpointSecret = process.env.WEBHOOK_KEY!;

router.post(
  "/api/webhook",
  express.raw({ type: "application/json" }),
  // requireAuth,
  // [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  // validateRequest,
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];

    if (!sig) {
      return res.redirect("http://localhost:3000/");
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook Error: ${err}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.async_payment_failed":
        const checkoutSessionAsyncPaymentFailed = event.data.object;
        console.log(checkoutSessionAsyncPaymentFailed);
        // Then define and call a function to handle the event checkout.session.async_payment_failed
        break;
      case "checkout.session.async_payment_succeeded":
        const checkoutSessionAsyncPaymentSucceeded = event.data.object;
        console.log(checkoutSessionAsyncPaymentSucceeded);
        // Then define and call a function to handle the event checkout.session.async_payment_succeeded
        break;
      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object;
        console.log(checkoutSessionCompleted);
        // Then define and call a function to handle the event checkout.session.completed
        break;
      case "checkout.session.expired":
        const checkoutSessionExpired = event.data.object;
        console.log(checkoutSessionExpired);
        // Then define and call a function to handle the event checkout.session.expired
        break;
      case "payment_intent.amount_capturable_updated":
        const paymentIntentAmountCapturableUpdated = event.data.object;
        console.log(paymentIntentAmountCapturableUpdated);
        // Then define and call a function to handle the event payment_intent.amount_capturable_updated
        break;
      case "payment_intent.canceled":
        const paymentIntentCanceled = event.data.object;
        console.log(paymentIntentCanceled);
        // Then define and call a function to handle the event payment_intent.canceled
        break;
      case "payment_intent.created":
        const paymentIntentCreated = event.data.object;
        console.log(paymentIntentCreated);
        // Then define and call a function to handle the event payment_intent.created
        break;
      case "payment_intent.partially_funded":
        const paymentIntentPartiallyFunded = event.data.object;
        console.log(paymentIntentPartiallyFunded);
        // Then define and call a function to handle the event payment_intent.partially_funded
        break;
      case "payment_intent.payment_failed":
        const paymentIntentPaymentFailed = event.data.object;
        console.log(paymentIntentPaymentFailed);
        // Then define and call a function to handle the event payment_intent.payment_failed
        break;
      case "payment_intent.processing":
        const paymentIntentProcessing = event.data.object;
        console.log(paymentIntentProcessing);
        // Then define and call a function to handle the event payment_intent.processing
        break;
      case "payment_intent.requires_action":
        const paymentIntentRequiresAction = event.data.object;
        console.log(paymentIntentRequiresAction);
        // Then define and call a function to handle the event payment_intent.requires_action
        break;
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log(paymentIntentSucceeded);
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    // const { token, orderId } = req.body;

    // const order = await Order.findById(orderId);

    // if (!order) {
    //   throw new NotFoundError();
    // }
    // if (order.userId !== req.currentUser!.id) {
    //   throw new NotAuthorizedError();
    // }
    // if (order.status === OrderStatus.Cancelled) {
    //   throw new BadRequestError("Cannot pay for an cancelled order");
    // }

    // const charge = await stripe.charges.create({
    //   currency: "usd",
    //   amount: order.price * 100,
    //   source: token,
    // });

    // const payment = Payment.build({
    //   orderId,
    //   stripeId: charge.id,
    // });
    // await payment.save();
    // new PaymentCreatedPublisher(natsWrapper.client).publish({
    //   id: payment.id,
    //   orderId: payment.orderId,
    //   stripeId: payment.stripeId,
    // });

    // res.status(201).send({ id: payment.id });
    return res.send();
  }
);

export { router as createChargeRouter };
