import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';
//interface untuk mapping TypeData kebutuhan Event
interface Event {
  subject: Subjects; //subject antara create/update
  data: any;
}
//memasukkan generic custom Type ke class listener
export abstract class Publisher<T extends Event> {
  //abstract subject harus sesuai dg isi Subject Enum
  abstract subject: T['subject'];
  //properti yang mengecek status koneksi nats
  //ambil properti (Stan) dari Library Node-Nats-streaming
  private client: Stan;
  //memasukkan client value to constructor
  constructor(client: Stan) {
    this.client = client;
  }
  //fungsi publish event ke Nats-Streaming (kirim data sesuai format interface) 
  publish(data: T['data']): Promise<void> {
    //beri fungc promis untuk cek apakan proses berhasil atau gagal
    return new Promise((resolve, reject) => {
      //terima data Event dari Channel tertentu dan prosses data yg dikirim
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log('Event published to subject', this.subject);
        resolve();
      });
    });
  }
}
