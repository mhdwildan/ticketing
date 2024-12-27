// @ts-nocheck
import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@mwdtickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

//class untuk menerima Event Ticket Updated
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    //panggil func find data by id and version, in ticket models
    const ticket = await Ticket.findByEvent(data);
    
    if (!ticket) { //jika data ticket tidak ditemukan
      throw new Error('Ticket not found');
    }
    
    const { title, price } = data; //destructuring properti data Event
    ticket.set({ title, price }); //update data title dan price sesuai isi Event
    await ticket.save();

    msg.ack(); //beri tahu Nats Event Listener sudah diproses
  }
}
