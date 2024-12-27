// @ts-nocheck
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@mwdtickets/common';

import { Password } from '../services/password';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    // signup Requirements Validate Email and Password
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  //validate user req with middleware
  validateRequest,
  async (req: Request, res: Response) => {
    //refactoring var email dan password dari request body
    const { email, password } = req.body;

    //mencari data email yang sama didalam data object User Collection
    const existingUser = await User.findOne({ email });
    //munculkan error jika tidak ada emial yg sama
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    //komparasi email dari user Request dengan data pass dari DB
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    //jika password tidak sama maka munculkan error
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      //masukkan key JWT dari pod Env Variable
      // tanda (!) dia akhir prevent error TS, data sudah di cek
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
