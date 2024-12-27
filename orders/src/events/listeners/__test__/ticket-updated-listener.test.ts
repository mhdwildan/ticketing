import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketUpdatedEvent } from '@mwdtickets/common';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

//setup fungction digunakan untuk melakukan tugas transaksi yang sama
//untuk di panggil di bebrapa metode test dibawah
const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // Create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new concert',
    price: 999,
    userId: 'ablskdjf',
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, ticket, listener };
};

it('finds, updates, and saves a ticket', async () => {
  //descructuring properti setup fungction
  const { msg, data, ticket, listener } = await setup();
  //listening fake data from setup func, and get processed
  await listener.onMessage(data, msg);
  //cek data yang disave sebelumnya
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title); //value title sama
  expect(updatedTicket!.price).toEqual(data.price); //value price sama
  expect(updatedTicket!.version).toEqual(data.version); //value version sama
});

it('acks the message', async () => {
  //descructuring properti setup fungction
  const { msg, data, listener } = await setup();
  //listening fake data from setup func, and get processed
  await listener.onMessage(data, msg);
  //pastikan event di proses dg baik
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  //descructuring properti setup fungction
  const { msg, data, listener, ticket } = await setup();
  //update wrong data version
  data.version = 10;
  
  try {
    //listening fake data from setup func, and got some Error version issue
    await listener.onMessage(data, msg);
  } catch (err) {}
  //pastikan event tidak di proses dg baik
  expect(msg.ack).not.toHaveBeenCalled();
});
