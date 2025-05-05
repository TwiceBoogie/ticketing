import { OrderCreatedEvent, OrderStatus, Subjects } from "@twicetickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../../queues/expiration-queue";

const setup = () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  // create fake data
  const data: OrderCreatedEvent["data"] = {
    id: "test_order_id",
    version: 0,
    status: OrderStatus.Created,
    userId: "test_user_id",
    expiresAt: new Date(Date.now() + 60_000).toISOString(), // 1 minute
    ticket: {
      id: "test_order_id",
      price: 0,
    },
  };

  const msg: Message = {
    ack: jest.fn(),
    getSubject: () => "test-subject",
    getSequence: () => 1,
    isRedelivered: () => false,
    getRawData: () => Buffer.from(""),
    getCrc32: () => 1,
    getTimestampRaw: () => 0,
    getTimestamp: () => new Date(),
    getData: () => "",
  };

  return { listener, data, msg };
};

describe("Handle Orders created events", () => {
  it("Order has been received", async () => {
    const { listener, data, msg } = setup();

    await listener.onMessage(data, msg);

    expect(expirationQueue.add).toHaveBeenCalledWith(
      { orderId: data.id },
      expect.objectContaining({
        delay: expect.any(Number),
      })
    );
  });

  it("acks the message", async () => {
    const { listener, data, msg } = setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
