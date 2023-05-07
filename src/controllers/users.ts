//Create routes:
//  POST /users/signup: create user in DB.
//      Store user with username and password keys in the DB.
//      -If successful, respond with JSON {msg: "Signup successful. Now you can log in."}.
//  POST /users/login: log user in (adds JWT to user in DB).
//      Check that a provided password and the password in the DB match.
//      -If they don't, respond with an error.
//      -If they do, respond with token (JWT), id and username

// Use
// req.body in both routes
// jsonwebtoken package
// jwt.sign to sign a token with:
//     payload (with id (user id) and username)
//     secret (from .env)

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

export { logIn, signUp };
