// @ts-nocheck
import express, { Request, Response } from 'express';
import { NotFoundError } from '@mwdtickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

//router show data tickets yang membutuhkan param id
router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  //cari data didalam model mongoDB yg sama dengan param id
  const ticket = await Ticket.findById(req.params.id);

  //jika tidak ada munculkan Error Not Found
  if (!ticket) {
    throw new NotFoundError();
  }
  //kembalikan data obj
  res.send(ticket);
});

//ubah nama agar tidak sama dengan route lain
export { router as showTicketRouter };
