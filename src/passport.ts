//Create users table in Postgres DB.
//Set up Passport authentication with JWT.
//Use SECRET key from .env

//Use passport and passport-jwt packages
//Create users table SQL query:
//  DROP TABLE IF EXISTS users;
//      CREATE TABLE users (
//          id SERIAL NOT NULL PRIMARY KEY,
//          username TEXT NOT NULL,
//          password TEXT NOT NULL,
//          token TEXT );

//Use dotenv package -> npm i dotenv | npm i passport passport-jwt
//Create .env file and store SECRET key

import * as dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import passportJWT from "passport-jwt";
import { db } from "./db";

const { SECRET } = process.env;

passport.use(
  new passportJWT.Strategy(
    {
      secretOrKey: SECRET,
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, done) => {
      const user = await db.one(`SELECT * FROM users WHERE id=$1`, payload.id);
      console.log(user);
      try {
        return user ? done(null, user) : done(new Error("User not found."));
      } catch (error) {
        done(error);
      }
    }
  )
);
