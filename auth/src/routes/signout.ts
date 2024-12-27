// @ts-nocheck
import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  //hapus value JWT yang ada di Cookie
  req.session = null;

  res.send({});
});

export { router as signoutRouter };
