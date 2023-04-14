// Write simple Express server that listens on port 3000 (use dotenv to specify the port)
// Create a dummy "database" of planets using a let variable.
// Configure your app (app.use()) to:
// accept JSON from the Client
// log the Client's requests

import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());

/********* Database ************/
type Planet = {
  id: number;
  name: string;
};

type Planets = Planet[];

let planets: Planets = [
  { id: 1, name: "Earth" },
  { id: 2, name: "Mars" },
];
/**********************************/

app.get("/app/planets", (request, response) => {
  response.json(planets);
});

app.listen(port, () => {
  console.log(`listening to http://localhost:${port}`);
});
