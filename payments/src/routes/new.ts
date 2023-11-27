import express, { Request, Response } from "express";

import { stripe } from "../stripe";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();
const endpointSecret = process.env.WEBHOOK_KEY!;

router.post(
  "/api/payments/webhook",
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
