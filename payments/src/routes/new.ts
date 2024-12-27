// @ts-nocheck
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
} from '@mwdtickets/common';
import { stripe } from '../stripe';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body; //destructuring data body
    //teumkan DB yg sama dengan inputan
    const order = await Order.findById(orderId);

    if (!order) { //jika data tidak ditemukan
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) { //autentikasi salah
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) { //jika status order sudah cancel
      throw new BadRequestError('Cannot pay for an cancelled order');
    }
    //buat transakdi ke Stripe API dengan class stripe yang sudah dibuat dg 3 param tambahan
    //- currency : mata uang pembayaran
    //- price : nilai pembayaran conver to cent 
    //- source : adalah token yang digunakan
    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });
    //buat data Record pembayaran di DB Payment
    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();
    //publish Event payment:created agar bisa diketahui oleh service lain
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as createChargeRouter };
