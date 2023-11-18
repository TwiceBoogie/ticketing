import express, { Request, Response } from "express";

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
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];

    if (!sig) {
      return res.redirect(`${process.env.REDIRECT_USER!}`);
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
      case "checkout.session.completed":
        const checkoutSessionCompleted = event.data.object;
        console.log(checkoutSessionCompleted, 3);
        // Then define and call a function to handle the event checkout.session.completed
        if (checkoutSessionCompleted.metadata) {
          const order = await Order.findById(
            checkoutSessionCompleted.metadata.orderId
          );
          const payment = Payment.build({
            orderId: order?.id,
            stripeId: checkoutSessionCompleted.id,
          });
          await payment.save();
          new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId,
          });
        }
        break;
      case "checkout.session.expired":
        const checkoutSessionExpired = event.data.object;
        console.log(checkoutSessionExpired, 4);
        // Then define and call a function to handle the event checkout.session.expired
        break;
      case "payment_intent.amount_capturable_updated":
        const paymentIntentAmountCapturableUpdated = event.data.object;
        console.log(paymentIntentAmountCapturableUpdated, 5);
        // Then define and call a function to handle the event payment_intent.amount_capturable_updated
        break;
      case "payment_intent.canceled":
        const paymentIntentCanceled = event.data.object;
        console.log(paymentIntentCanceled, 6);
        // Then define and call a function to handle the event payment_intent.canceled
        break;
      case "payment_intent.created":
        const paymentIntentCreated = event.data.object;
        console.log(paymentIntentCreated, 7);
        // Then define and call a function to handle the event payment_intent.created
        break;
      case "payment_intent.partially_funded":
        const paymentIntentPartiallyFunded = event.data.object;
        console.log(paymentIntentPartiallyFunded, 8);
        // Then define and call a function to handle the event payment_intent.partially_funded
        break;
      case "payment_intent.payment_failed":
        const paymentIntentPaymentFailed = event.data.object;
        console.log(paymentIntentPaymentFailed, 9);
        // Then define and call a function to handle the event payment_intent.payment_failed
        break;
      case "payment_intent.processing":
        const paymentIntentProcessing = event.data.object;
        console.log(paymentIntentProcessing, 10);
        // Then define and call a function to handle the event payment_intent.processing
        break;
      case "payment_intent.requires_action":
        const paymentIntentRequiresAction = event.data.object;
        console.log(paymentIntentRequiresAction, 11);
        // Then define and call a function to handle the event payment_intent.requires_action
        break;
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        console.log(paymentIntentSucceeded, 12);
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
