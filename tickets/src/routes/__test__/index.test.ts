import request from 'supertest';
import { app } from '../../app';

//function membuat data ticket
const createTicket = () => {
  return request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'asldkf',
    price: 20,
  });
};

it('can fetch a list of tickets', async () => {
  //panggil data tiket 3x
  await createTicket();
  await createTicket();
  await createTicket();

  //jalankan test di app.js
  const response = await request(app).get('/api/tickets').send().expect(200);
  //cek apakah ada list data tickt 3 pcs
  expect(response.body.length).toEqual(3);
});
