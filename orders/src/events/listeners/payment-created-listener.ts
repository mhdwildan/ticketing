import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@mwdtickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    //cari order data dari param event payment:create
    const order = await Order.findById(data.orderId);

    if (!order) { //jika data order tidak ditemukan
      throw new Error('Order not found');
    }
    
    order.set({ //ubah data order status menjadi Complete
      status: OrderStatus.Complete,
    });
    await order.save(); //sinpan data Order

    msg.ack(); //Beri tahu Nats event sudah berhasil di proses
  }
}
