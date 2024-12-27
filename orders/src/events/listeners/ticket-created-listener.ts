// @ts-nocheck
import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@mwdtickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

//class untuk menerima Event Ticket Created/baru
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName; 

  //format data listener sama dengan publish
  //msg: adalah library nats-streaming yang mempunyai func Ack()
  //ack() adalah fungsi untuk memberitahu nats jika Event yg diterima oleh service berhasil di proses
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data; //destructuring properti data Event
    //buat Ticket Data dengan properti id, title & proce
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack(); //beri tahu Nats Event Listener sudah diproses
  }
}
