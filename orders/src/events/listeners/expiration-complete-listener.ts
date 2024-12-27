import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  OrderStatus,
} from '@mwdtickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    //cari order data dari param event expiration:complete
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) { //jika data tidak ditemukan
      throw new Error('Order not found');
    }
    //jangan proses order cancelled jika status sudah complete
    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    //edit status order ke cancel
    order.set({ 
      status: OrderStatus.Cancelled,
    });
    await order.save(); //simpan ke DB Order
    //publish ke Nats kalu ada transaksi order cancel krn Expired
    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    msg.ack(); //beri tahu nats proses listen berhasil
  }
}
