import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T["subject"];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"], retries = 3): Promise<void> {
    return new Promise((resolve, reject) => {
      const attempt = (retryCount: number) => {
        this.client.publish(this.subject, JSON.stringify(data), (err) => {
          if (err) {
            console.error(`Publish failed on subject ${this.subject}: `, err);
            if (retryCount > 0) {
              console.log(`Retrying publish...attempts left: ${retryCount}`);
              setTimeout(() => attempt(retryCount - 1), 500);
            } else {
              return reject(err);
            }
          } else {
            console.log("Event published to subject", this.subject);
            resolve();
          }
        });
      };
      attempt(retries);
    });
  }
}
