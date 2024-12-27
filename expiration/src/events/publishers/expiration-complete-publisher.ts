import { Subjects, Publisher, ExpirationCompleteEvent, } from '@mwdtickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
