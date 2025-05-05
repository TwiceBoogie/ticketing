import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@twicetickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const { title, price, stripePriceId } = data;
    if (!stripePriceId) {
      ticket.set({ title, price });
    } else {
      ticket.set({ title, price, stripePriceId });
    }
    await ticket.save();

    msg.ack();
  }
}
