import nats, { Message } from 'node-nats-streaming'; //library nats-streaming
import { randomBytes } from 'crypto'; //library untuk generate ramdon number

console.clear();//agar menampilkan hanya info event
//koneksikan nats dengan 2 parameter
//"ticketing"
//"randomBytes(4).toString('hex')" adalah param dari ID service listener (agar bisa duplikat)
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222', //url dari setting deployment
});
//fungsi konek ke NATS Streaming
stan.on('connect', () => {
  console.log('Listener connected to NATS');
  //beritahu Nats kalau segera menutup akses ketika ada perintah tutup
  //dari terminal
  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });
  //setting AckMode ON pada Event listener ini
  const options = stan.subscriptionOptions().setManualAckMode(true).setDeliverAllAvailable().setDurableName('accounting-service');
  //ambil data Event dari Nats-Streaming dengan 2 param
  //'ticket:created' Channel Subscription
  //'orders-service-queue-group' queue group
  const subscription = stan.subscribe(
    'ticket:created',
    'orders-service-queue-group',
    options
  );
  //ambil data event 
  subscription.on('message', (msg: Message) => {
    const data = msg.getData(); //extract info data dr event tsb

    if (typeof data === 'string') {
      //tampilkan data Urutan fitur Nats-Streaming 
      //dan isi data dari event   
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }
    //kirimkan message ACK fungtion untuk menandakan procces berhasil
    //sehingga Nats tidak menunggu status dari Event tsb
    msg.ack();
  });
});

//handler jika close program paksa
process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());