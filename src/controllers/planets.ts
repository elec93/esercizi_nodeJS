//     Add image field to planets table in the DB.
//     Set POST /planets/:id/image route for file upload (planet's image).
//     Store the image file locally (on disk).
//     Save file path to DB (update the correct planet).

//Use

//     Add image TEXT to your CREATE TABLE planets SQL query.
//     Use multer library to save files to /uploads folder.
//     Add image TEXT to CREATE TABLE planets SQL query (in your DB setup).
//     Use this SQL query to update planet's image:
//      UPDATE planets
//      SET image=$2
//      WHERE id=$1;

//Use Postman to test the upload route (you can send a file in Postman).

import { Request, Response } from "express";
import Joi, { number } from "joi";
import pgPromise from "pg-promise"; // npm i pg-promise

const db = pgPromise({})(
  `postgress://postgres:postgres@lochalhost:5432/postgres`
); //link del database -> user e password (postgres:postgres)

//funzione setupDb -> creo la tabella con due pianeti
const setupDb = async () => {
  db.none(`
    DROP TABLE IF EXISTS planets; 

    CREATE TABLE planets (
      id SERIAL NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT
   );
  `);
  await db.none(`INSERT INTO planets (name) VALUES ('Earth')`); //inserisci una riga nella tabella planets col nome con la seguente value
  await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
};

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
