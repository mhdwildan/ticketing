import nats, { Message, Stan } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  //panggil class child create data event
  new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

abstract class Listener {
  //status abstract adalah ketika properti membutuhkan value dr child class nya 
  abstract subject: string; //untuk menampung nama channel Nats
  abstract queueGroupName: string; //untuk menampung nama queue Group Nats
  //fungsi yang berjalan ketika listener menerima Event
  abstract onMessage(data: any, msg: Message): void;
  //properti yang mengecek status koneksi nats
  //ambil properti (Stan) dari Library Node-Nats-streaming
  private client: Stan; 
  protected ackWait = 5 * 1000; //setup ackWait 5 detik

  //memasukkan client value to constructor
  constructor(client: Stan) {
    this.client = client;
  }

  //function subscription option sesuai dg settinf sebelumnya
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait) //set waktu tunggu AcWait 5s sesuai properti diatas
      .setDurableName(this.queueGroupName); //set nama Durable sesuai queue grup name
  }

  //fungsi menangkap event
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    //memprocess event yang ditangkap
    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      //panggil func convert Event data to string dibawah
      const parsedData = this.parseMessage(msg);
      //process Event yang diterima dengan param data JSON
      this.onMessage(parsedData, msg);
    });
  }

  //mengubah data event menjadi string
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}

//Child Class untuk memanggil fungsi channel create data
class TicketCreatedListener extends Listener {
  subject = 'ticket:created'; //nama channel
  queueGroupName = 'payments-service'; //nama queue group
  //fungsi yang dijalankan
  onMessage(data: any, msg: Message) {
    console.log('Event data!', data);

    msg.ack(); // beri sinyal proses handle Event berhasil
  }
}
