import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  orderId: string;
  sessionId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

// job is an object that wraps our data and also has some metadata
expirationQueue.process(async (job) => {
  console.log(`Processing job with orderId: ${job.data}`);
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
    sessionId: job.data.sessionId,
  });
});

export { expirationQueue };
