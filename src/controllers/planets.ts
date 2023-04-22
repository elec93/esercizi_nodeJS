// Add planets Controller (`controllers/planets.ts`) consisting of the following functions:
//   - `getAll`
//   - `getOneById`
//   - `create`
//   - `updateById`
//   - `deleteById`.
// - Then, replace callback functions in routes `(req: Request, res: Response) =>` with the functions above. (For example: the route `/api/planets` should use `getAll` function.)

// ## Use
// - The dummy database of planets from the previous exercise.
// - `Array.prototype.find` higher-order function to Get One.
// - Spread operator (`[...planets]`) to Create.
// - `Array.prototype.map` higher-order function to Update.
// - `Array.prototype.filter` higher-order function to Delete.

import { Request, Response } from "express";
import Joi from "joi";

/************ Database ************/
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

const getAll = (request: Request, response: Response) => {
  response.status(200).json(planets);
};

const getOneById = (request: Request, response: Response) => {
  const { id } = request.params;
  const planet = planets.find((p) => p.id === Number(id));
  response.status(200).json(planet);
};

const planetSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
});

const create = (request: Request, response: Response) => {
  const { id, name } = request.body;
  const newPlanet: Planet = { id, name };
  const validateNewPlanet = planetSchema.validate(newPlanet);

  if (validateNewPlanet.error) {
    return response
      .status(400)
      .json({ msg: validateNewPlanet.error.details[0].message });
  } else {
    planets = [...planets, newPlanet];
    response.status(201).json({ msg: "planet created!" });
  }
};

const updateById = (request: Request, response: Response) => {
  const { id } = request.params;
  const { name } = request.body;
  planets = planets.map((p) => (p.id === Number(id) ? { ...p, name } : p));

  response.status(200).json({ msg: "planet updated!" });
};

const deleteById = (request: Request, response: Response) => {
  const { id } = request.params;
  planets = planets.filter((p) => p.id !== Number(id));

  response.status(200).json({ msg: "planet deleted!" });
};

export { getAll, getOneById, create, updateById, deleteById };
