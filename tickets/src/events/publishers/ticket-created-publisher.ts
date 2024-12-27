import { Publisher, Subjects, TicketCreatedEvent } from '@mwdtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
