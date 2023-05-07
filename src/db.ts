import pgPromise from "pg-promise"; // npm i pg-promise

const db = pgPromise({})(
  `postgress://postgres:postgres@lochalhost:5432/postgres`
);

const setupDb = async () => {
  db.none(`
    DROP TABLE IF EXISTS planets; 

    CREATE TABLE planets (
      id SERIAL NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT
   );

   DROP TABLE IF EXIST users;

   CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    token TEXT
   )
  `);
  await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
  await db.none(
    `INSERT INTO users (username, password) VALUES ('dummy', 'dummy')`
  );
};
setupDb();

export { db };
