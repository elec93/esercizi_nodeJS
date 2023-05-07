import { Request, Response } from "express";
import Joi, { number } from "joi";
import {db} from "./../db.js"

//SELECT * FROM planets;
const getAll = async (request: Request, response: Response) => {
  const planets = await db.many(`SELECT * FROM planets;`);
  response.status(200).json(planets);
};

//SELECT * FROM planets WHERE id=$1; Make sure that `$1` is `id`.
const getOneById = async (request: Request, response: Response) => {
  const { id } = request.params;
  const planet = await db.oneOrNone(
    `SELECT * FROM planets WHERE id=$1;`,
    Number(id)
  );

  response.status(200).json(planet);
};

//INSERT INTO planets (name) VALUES ($1); Make sure that `$1` is `name`.
const planetSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
});

const create = async (request: Request, response: Response) => {
  const { id, name } = request.body;
  const newPlanet = { id, name };
  const validateNewPlanet = planetSchema.validate(newPlanet);

  if (validateNewPlanet.error) {
    return response
      .status(400)
      .json({ msg: validateNewPlanet.error.details[0].message });
  } else {
    await db.none(`INSERT INTO planets (name) VALUES ($1)`, name);
    response.status(201).json({ msg: "planet created!" });
  }
};

//UPDATE planets SET name=$2 WHERE id=$1; Make sure that `$1` is `id` and `$2` is `name`.
const updateById = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { name } = request.body;

  await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [id, name]);

  response.status(200).json({ msg: "planet updated!" });
};

//DELETE FROM planets WHERE id=$1; Make sure that `$1` is `id`.
const deleteById = async (request: Request, response: Response) => {
  const { id } = request.params;

  await db.none(`DELETE FROM planets WHERE id=$1;`, Number(id));

  response.status(200).json({ msg: "planet deleted!" });
};

/*******************************/
const createImage = async (request: Request, response: Response) => {
  console.log(request.file);
  const { id } = request.params;
  const filename = request.file?.path;
  if (filename) {
    response.status(201).json({ msg: "image uploaded succesfully" });
  } else {
    response.status(400).json({ msg: "image uploaded failed" });
  }
};
/*******************************/

export { getAll, getOneById, create, updateById, deleteById, createImage };
