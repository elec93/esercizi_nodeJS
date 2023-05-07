//Create route:
//  GET /users/logout: log user out (removes JWT from user in DB).
//Create authorize middleware and use it in routes that require it (protected routes).
//Restrict file upload of planet images to users.

//Use SQL query:
//  UPDATE users SET token=NULL WHERE id=$1;

//Make sure that $1 is the user's id
//passport.authenticate() in authorize function
//  set session to false in passport.authetnicate (2nd param)
//  when successful, do: req.user = user (user comes from (err, user) cb func that passport.authenticate provides (3rd param))

import * as dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import { db } from "./../db.js";
import jwt from "jsonwebtoken";

const logIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await db.one(`SELECT * FROM users WHERE username=$1`, username);

  if (user && user.password === password) {
    const payload = {
      id: user.id,
      username,
    };
    const { SECRET = "" } = process.env;
    const token = jwt.sign(payload, SECRET);

    console.log(token);

    await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user.id, token]);
    res.status(200).json({});
  } else {
    res.status(400).json({ msg: "Username or password incorrect." });
  }
};

const signUp = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await db.oneOrNone(
    `SELECT * FROM users WHERE username=$1`,
    username
  );
  if (user) {
    res.status(409).json({ msg: "User already exist" });
  } else {
    const { id } = await db.one(
      `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`,
      [username, password]
    );
    res.status(201).json({ id, msg: "Signup successful. Now you can log in." });
  }
};

const logOut = async (req: Request, res: Response) => {
  const user = req.user;
  await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user?.id, null]);
  res.status(200).json({ msg: "Logout successful." });
};

export { logIn, signUp, logOut };
