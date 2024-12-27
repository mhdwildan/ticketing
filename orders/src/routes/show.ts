// @ts-nocheck
import express, { Request, Response } from 'express';
import {
  requireAuth,
  NotFoundError,
  NotAuthorizedError,
} from '@mwdtickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    //cari data order yang sama dengan param :orderId
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if (!order) { //jika data order tidak ditemukan
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) { 
      //jika data UserId order tidak sama dengan Auth
      throw new NotAuthorizedError();
    }
    res.send(order);
  }
);

export { router as showOrderRouter };
