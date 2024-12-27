// @ts-nocheck
import { Listener, OrderCancelledEvent, Subjects } from '@mwdtickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    // If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    //set property orderId to undefined
    ticket.set({ orderId: undefined });
    await ticket.save(); // simpan data dan update version+1
    //Do Event publish lastest data Ticket to Nats Streaming
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      price: ticket.price,
      title: ticket.title,
      version: ticket.version,
    });

    msg.ack();
  }
}
