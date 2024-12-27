// @ts-nocheck
import express from 'express';
import { currentUser, requireAuth } from '@mwdtickets/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, requireAuth, (req, res) => {
  //cek value req.currentUser hasil dari middleware
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
