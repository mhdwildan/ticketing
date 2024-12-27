import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';
//interface untuk properti apa yang dibutuhkan untuk Job Queue
interface Payload {
  orderId: string;
}
//librabry func queue with 2 params: name channel queue redis dan alamat host
const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST, //host redis from env in deployment setup
  },
});
//buat Event publish Expiration:complete setelah melewati batas yg ditentukan
expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
