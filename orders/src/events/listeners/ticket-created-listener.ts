import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@twicetickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price, stripePriceId } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
      stripePriceId,
    });
    console.log(
      `${id} from ticket-service`,
      `${ticket.id} id from orders-service (here)`
    );
    await ticket.save();

    msg.ack();
  }
}
