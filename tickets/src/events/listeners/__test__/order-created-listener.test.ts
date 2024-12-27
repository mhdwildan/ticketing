import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@mwdtickets/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

//setup fungction digunakan untuk melakukan tugas transaksi yang sama
//untuk di panggil di bebrapa metode test dibawah
const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf',
  });
  await ticket.save();

  // Create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'alskdfj',
    expiresAt: 'alskdjf',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
  //descructuring properti setup fungction
  const { listener, ticket, data, msg } = await setup();
  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  //cari di DB ticket yang baru dibuat
  const updatedTicket = await Ticket.findById(ticket.id);
  
  expect(updatedTicket!.orderId).toEqual(data.id); //pastikan id nya sama
});

it('acks the message', async () => {
  //descructuring properti setup fungction
  const { listener, ticket, data, msg } = await setup();
  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled(); //pastikan listening Event di tangkan dan diproses
});

it('publishes a ticket updated event', async () => {
  //descructuring properti setup fungction
  const { listener, ticket, data, msg } = await setup();
  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled(); //pastikan func publish berjalan

  const ticketUpdatedData = JSON.parse(
    //mencari data orderId dari Event fake Nats
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  //value orderId ticket dan OrderId yang di Event sama
  expect(data.id).toEqual(ticketUpdatedData.orderId); 
});
