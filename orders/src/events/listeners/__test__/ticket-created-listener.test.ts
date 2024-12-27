import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@mwdtickets/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

//setup fungtion digunakan untuk melakukan tugas transaksi yang sama
//untuk di panggil di bebrapa metode test dibawah
const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  //descructuring properti setup fungction
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined(); //ticket ditemukan
  expect(ticket!.title).toEqual(data.title); //value dari title sesuai
  expect(ticket!.price).toEqual(data.price); //value dari price sesuai
});

it('acks the message', async () => {
  //descructuring properti setup fungction
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled(); 
});
