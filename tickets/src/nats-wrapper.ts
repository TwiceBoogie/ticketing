import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private _client?: Stan;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access NATS client before connecting");
    }

    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    let attempts = 0;
    const maxAttempts = 10;
    const baseDelay = 1000;

    return new Promise<void>((resolve, reject) => {
      const attemptConnection = () => {
        attempts++;
        console.log(
          `Attempting to connect to NATS (Attempt ${attempts}/${maxAttempts})...`
        );

        this._client = nats.connect(clusterId, clientId, { url });

        this.client.on("connect", () => {
          console.log("Connected to NATS");
          resolve();
        });
        this.client.on("error", (err) => {
          console.error("Nats connection error: ", err);

          if (attempts < maxAttempts) {
            const delay = Math.min(baseDelay * 2 ** (attempts - 1), 30000); // Exponential backoff
            console.log(`Retrying in ${delay / 1000} seconds...`);
            setTimeout(attemptConnection, delay);
          } else {
            console.error("Max retry attempts reached. Giving up.");
            reject(err);
          }
        });

        this._client.on("close", () => {
          console.log("NATS connection closed!");
          process.exit();
        });
      };

      attemptConnection();
    });
  }
}

export const natsWrapper = new NatsWrapper();
