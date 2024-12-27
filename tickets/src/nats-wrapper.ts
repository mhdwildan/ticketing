import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  //var client bersifat privat agar tidak bisa diubah dr luar
  private _client?: Stan;

  //cek koneksi untuk validasi sebelum publish event
  get client() {
    if (!this._client) {
      throw new Error ('Cannot access NATS client before connecting');
    }

    return this._client;
  }

  //func yang dipanggil dari file index untuk mengkoneksikan dg NATS
  connect(clusterId: string, clientId: string, url: string) {
    //mengkoneksikan service tickets dengan NATS
    this._client = nats.connect(clusterId, clientId, { url });

    //cek koneksi service dg NATS
    return new Promise<void>((resolve, reject) => {
      this._client!.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this._client!.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
