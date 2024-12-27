// @ts-nocheck
import express, { Request, Response } from "express";
//instal validation package : $ npm i express-validator
import { body } from "express-validator";
// $ npm install jsonwebtoken @types/jsonwebtoken
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from "@mwdtickets/common";

import { User } from "../models/user";
//fungsi pengalamatan url pada app
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    // signup Requirements Validate Email and Password
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  //validate user req with middleware
  validateRequest,
  async (req: Request, res: Response) => {

    //refactoring var email dan password dari request body 
    const { email, password } = req.body;

    //mencari data email yang sama didalam data object User Collection
    const existingUser = await User.findOne({ email });

    //menampilkan error sesuai format Custom saat menemukan email yg sama
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    //simpan data email dan password ke database
    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      //masukkan key JWT dari pod Env Variable
      // tanda (!) dia akhir prevent error TS, data sudah di cek
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt
    };

    res.status(201).send(user);
  }
);

//rename export dunction router 
//agar tidak menyamai yg lain
export { router as signupRouter };
