import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123'
  });

  // Save the ticket to the da tabase
  await ticket.save(); //version 0

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id); //version 1
  const secondInstance = await Ticket.findById(ticket.id); //version 1

  // make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save the first fetched ticket
  await firstInstance!.save(); // version 0 update to 1

  // save the second fetched ticket and expect an error
  try {
    await secondInstance!.save(); // version 1 update to 1 (cannot)
  } catch (err) {
    return;
  }
  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  });

  await ticket.save(); //version 0
  expect(ticket.version).toEqual(0);
  await ticket.save(); //version 1
  expect(ticket.version).toEqual(1);
  await ticket.save(); //version 2
  expect(ticket.version).toEqual(2);
});
