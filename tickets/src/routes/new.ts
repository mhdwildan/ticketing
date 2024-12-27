// @ts-nocheck
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@mwdtickets/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

//use miidleware "requireAuth" untuk memeriksa session ada/tidak
//use miidleware "validateRequest" untuk memeriksa inputan valid
router.post('/api/tickets', requireAuth, [
  body('title').not().isEmpty().withMessage('Title is Required'),
  body('price').isFloat({ gt : 0 }).withMessage('Price is greater than 0')
], validateRequest, 
async (req: Request, res: Response) => {
  //destructuring data from response
  const { title, price } = req.body;

    //Save data to mongoDB with Model
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    //publishing event new ticket ke NATS Streaming
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    //respon obj data save
    res.status(201).send(ticket);
});

//ubah nama agar tidak sama dengan route lain
export { router as createTicketRouter };
