import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('returns a 404 if the provided id does not exist', async () => {
   //buat fake data id data tickets
  const id = new mongoose.Types.ObjectId().toHexString();
  //cari data fake id yang akan di edit maka akan muncul Error NotFound
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'aslkdfj',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  //buat fake data id data tickets
  const id = new mongoose.Types.ObjectId().toHexString();
  //cari data tanpa ada Sutentikasi maka retur errorNotAuthenticated
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'aslkdfj',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  //buat data dengan user generate unique id
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'asldkfj',
      price: 20,
    });

  //buat data dengan user generate unique id baru
  //maka akan mengembalikan erroNotAuthorized karena data user berbeda
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'alskdjflskjdf',
      price: 1000,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  //buat data fake signid dan disimpan di var cookie
  const cookie = global.signin();

  //buat data dengan autentikasi id var cookie
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
    });

  //buat title kosong akan menghasilkan errorValidateData
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  //buat price minus akan menghasilkan errorValidateData
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'alskdfjj',
      price: -10,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  //buat data fake signid dan disimpan di var cookie
  const cookie = global.signin();

  //buat data dengan autentikasi id var cookie 
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
    });

  //edit data dengan autentikasi sama dan inputan valid, maka transaksi success
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200);

  //periksa specifik data dengan param id
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  //psatikan isidata sesuai dengan yang diedit
  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(100);
});

//cek apakah simulasi publish berjalan baik
it('publishes an event', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200);

  //Publishing ke Fake Event telah dilakukan
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.signin(); //data current user
  //create data ticket
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
    });

  const ticket = await Ticket.findById(response.body.id); //select ticket yang baru dibuat
  //masukkan dummy data orderId agar mensimulasi ticket sedang dlam proses order
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save(); //simpan ke DB Ticket
  //buat update ticket pada data diatat
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie) //valid userId
    .send({ //valid input
      title: 'new title',
      price: 100,
    })
    .expect(400); //expect Error Bad Request
});