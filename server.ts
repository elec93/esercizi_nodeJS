// Write a router with the following routes: (sono scritte dopo)
// Validate planet fields where appropriate.

//Use:
//-The dummy database of planets from the previous exercise.
//-joi library for validation

//Check:
//-Use Postman to test the routes.
//-Paths POST and PUT should receive data in JSON format (req.body).

import express, { request, response } from "express";
import "express-async-errors";
import morgan from "morgan";
import Joi from "joi";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());

const planetSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required()
});

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

//`GET /api/planets`: return all planets (JSON) with `200`
app.get("/api/planets", (request, response) => {
  response.status(200).json(planets);
});

//`GET /api/planets/:id`: return a planet (JSON) by id with `200`
app.get("/api/planets/:id", (request, response) => {
  const { id } = request.params;
  const planet = planets.find((p) => p.id === Number(id));
  response.status(200).json(planet);
});

//`POST /api/planets`: create a planet, return only `201` code and a success JSON with key `msg`
//Make sure every planet is created with `id` and `name`.
app.post("/api/planets", (request, response) => {
  const { id, name } = request.body;
  const newPlanet = { id, name };
  const validateNewPlanet = planetSchema.validate(newPlanet)

  if (validateNewPlanet.error) {
    return response.status(400).json({msg: validateNewPlanet[0].error})
  } else {
    planets = [...planets, newPlanet];
    console.log(planets);
    response.status(201).json({ msg: "planet created!" });
  }
});

//`PUT /api/planets/:id`: update a planet by id, return only `200` code and a success JSON with key `msg`
app.put("/api/planets/:id", (request, response) => {
  const { id } = request.params;
  const { name } = request.body;
  planets = planets.map( p => p.id === Number(id) ? ({...p, name}) : p )

  console.log(planets);

  response.status(200).json({msg: "planet updated!"})
})

//`DELETE /api/planets/:id`: delete a planet by id, return only `200` code and a success JSON with key `msg`
app.delete("/api/planets/:id", (request, response) => {
  const { id } = request.params;
  planets = planets.filter( p => p.id !== Number(id))

  console.log(planets);

  response.status(200).json({msg: "planet deleted!"})
})

app.listen(port, () => {
  console.log(`listening to http://localhost:${port}`);
});
