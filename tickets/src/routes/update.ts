// @ts-nocheck
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@mwdtickets/common';
import { Ticket } from '../models/ticket';
import { TicketUpdatedEvent } from '@mwdtickets/common';
import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';

const router = express.Router();

//use miidleware "requireAuth" untuk memeriksa session ada/tidak
//use miidleware "validateRequest" untuk memeriksa inputan valid
router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    //temukan data sesuai param id di model mongoDB
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      //jika data tidak ada kembalikan shared lib errorNotFound
      throw new NotFoundError();
    }

    if (ticket.orderId) { //jika orderId is not Undefined
      //reject The update function because ticket is process order
      throw new BadRequestError('Cannot edit a reserved ticket');
    }

    if (ticket.userId !== req.currentUser!.id) {
      //jika userId bukan currentUser kembalikan shared lib errorNotAuthorized
      throw new NotAuthorizedError();
    }

    //simpan ke Model data mongoDB
    ticket.set({
      title: req.body.title,
      price: req.body.price,
    });
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
