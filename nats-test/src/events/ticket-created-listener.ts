import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
//import untuk kebutuhan Formatting Data proses
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';
// masukkan generic type untuk memberitahu Type data & properti yang diproses
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated; //masukkan Enum Subject create/update

  queueGroupName = 'payments-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.price);

    msg.ack();
  }
}
