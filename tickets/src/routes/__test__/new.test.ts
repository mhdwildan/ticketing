import request from 'supertest';
//import app untuk bahan check nya
import { app } from '../../app';
//import Models
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

//check apakah route tersedia
it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404);
});

//cek apakah Error user Not Authorize muncul saat currentUser = null
it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

//cek apakah fungsi berjalan jika currentUser ada object
it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    //masukkan fake login yang dibuat di ..test/setup.ts
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

//cek apakah muncul Error data not Valid ketika input data "title" kosong
it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

//cek apakah muncul Error data not Valid ketika input data "price" kosong
it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asldkjf',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'laskdfj',
    })
    .expect(400);
});

//cek transaksi dummy data berhasil
it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'asldkfj';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});

//cek apakah simulasi publish berjalan baik
it('publishes an event', async () => {
  const title = 'asldkfj';

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  //Publishing ke Fake Event telah dilakukan
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
