// - Using PgAdmin:
//   - Create a Postgres DB.
// - Using a `setupDb` function:
//   - Create `planets` table.
//   - Populate the table with two planets (e.g. `'Earth'` and `'Mars'`).
// - Connect your app to Postgres using Express (`pg-promise`). [https://github.com/vitaly-t/pg-promise]
// - Replace the dummy DB with the Postgres DB.
// - Rewrite all planets controller functions. They should now work with the DB. (Use the SQL queries below.)

// ## Use
// - SQL query to create the table:
//   DROP TABLE IF EXISTS planets;
//   CREATE TABLE planets(
//     id SERIAL NOT NULL PRIMARY KEY,
//     name TEXT NOT NULL,
//   );

// - Make sure that all CRUD operations read from and write to Postgres (instead of the dummy db you've been using in previous exercises).
//   - `GET /planets`
//     - Use this SQL query: SELECT * FROM planets;
//   - `GET /planets/:id`
//     - Use this SQL query: SELECT * FROM planets WHERE id=$1; Make sure that `$1` is `id`.
//   - `POST /planets`
//     - Use this SQL query: INSERT INTO planets (name) VALUES ($1); Make sure that `$1` is `name`.
//   - `PUT /planets/:id`
//     - Use this SQL query: UPDATE planets SET name=$2 WHERE id=$1; Make sure that `$1` is `id` and `$2` is `name`.
//   - `DELETE /planets/:id`
//     - Use this SQL query: DELETE FROM planets WHERE id=$1; Make sure that `$1` is `id`.

import { Request, Response } from "express";
import Joi, { number } from "joi";
import pgPromise from "pg-promise"; // npm i pg-promise

const db = pgPromise({})(`postgress://postgres:postgres@lochalhost:5432/postgres`); //link del database -> user e password (postgres:postgres)

//funzione setupDb -> creo la tabella con due pianeti
const setupDb = async () => {
  db.none(`
    DROP TABLE IF EXISTS planets; 

    CREATE TABLE planets (
      id SERIAL NOT NULL PRIMARY KEY,
      name TEXT NOT NULL
   );
  `)
  await db.none(`INSERT INTO planets (name) VALUES ('Earth')`) //inserisci una riga nella tabella planets col nome con la seguente value
  await db.none(`INSERT INTO planets (name) VALUES ('Mars')`)
};

//SELECT * FROM planets;
const getAll = async (request: Request, response: Response) => {
  const planets = await db.many(`SELECT * FROM planets;`);
  response.status(200).json(planets);
};

//SELECT * FROM planets WHERE id=$1; Make sure that `$1` is `id`.
const getOneById = async (request: Request, response: Response) => {
  const { id } = request.params;
  const planet = await db.oneOrNone(`SELECT * FROM planets WHERE id=$1;`, Number(id));

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
    await db.none(`INSERT INTO planets (name) VALUES ($1)`, name)
    response.status(201).json({ msg: "planet created!" });
  }
};

//UPDATE planets SET name=$2 WHERE id=$1; Make sure that `$1` is `id` and `$2` is `name`.
const updateById = async (request: Request, response: Response) => {
  const { id } = request.params;
  const { name } = request.body;

  await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [id, name])

  response.status(200).json({ msg: "planet updated!" });
};

//DELETE FROM planets WHERE id=$1; Make sure that `$1` is `id`.
const deleteById = async (request: Request, response: Response) => {
  const { id } = request.params;

  await db.none(`DELETE FROM planets WHERE id=$1;`, Number(id))

  response.status(200).json({ msg: "planet deleted!" });
};


export { getAll, getOneById, create, updateById, deleteById };
