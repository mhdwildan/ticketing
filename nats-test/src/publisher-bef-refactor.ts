import nats from 'node-nats-streaming'; //library nats-streaming

console.clear(); //agar menampilkan hanya info event
//koneksikan nats dengan 2 parameter
//"ticketing"
//"abc" adalah param dari ID service publisher
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222', //url dari setting deployment
});
//fungsi konek ke NATS Streaming
stan.on('connect', () => {
  console.log('Publisher connected to NATS');
  //data yg dikirim ke Event (harus format JSON)
  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });
  //publish (kirim events) ke NATS Server dg channel:'ticket:created'
  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });
});
