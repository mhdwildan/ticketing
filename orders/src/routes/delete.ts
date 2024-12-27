// @ts-nocheck
import express, { Request, Response } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@mwdtickets/common';
import { Order, OrderStatus } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const { orderId } = req.params; //masukkan id param :orderId ke var
    //temukan data order yang sama dengan var param
    //populate untuk menyertakan data ticket yg terkoneksi dg Order
    const order = await Order.findById(orderId).populate('ticket');

    if (!order) { //jika data tidak ditemukan
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      //jika data pembuat Order tidak sama dengan currentUser
      throw new NotAuthorizedError();
    }
    //set Status Order to Cancelled
    order.status = OrderStatus.Cancelled;
    await order.save();

    // publishing an event saying this was cancelled!
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id, //id order
      version: order.version,
      ticket: {
        id: order.ticket.id, //id ticket
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
