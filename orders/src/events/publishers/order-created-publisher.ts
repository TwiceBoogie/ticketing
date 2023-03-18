import { Publisher, OrderCreatedEvent, Subjects } from "@twicetickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
