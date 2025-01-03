// @ts-nocheck
import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, OrderStatus, NotFoundError, BadRequestError } from '@mwdtickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

//set var untuk nilai expired order (15 min)
const EXPIRATION_WINDOW_SECONDS = 1 * 60;
//const EXPIRATION_WINDOW_SECONDS = 20; //trial

//route untuk membuat order baru
router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty() //cek idTicket tidak kosong
      //validasi input idTicet sesuai dengan formatting mongoDB
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id, //dari middleware currentUser
      status: OrderStatus.Created, //set to Create
      expiresAt: expiration, //dari set expired diatas
      ticket, //dari body inputan route New Orders
    });
    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      version: order.version,
      //json cannot handle date format just convert to string
      expiresAt: order.expiresAt.toISOString(), 
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
