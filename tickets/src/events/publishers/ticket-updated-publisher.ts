import { Publisher, Subjects, TicketUpdatedEvent } from '@mwdtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
