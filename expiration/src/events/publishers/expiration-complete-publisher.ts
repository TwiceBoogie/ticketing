import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@twicetickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
