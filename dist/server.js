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
import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import { getAll, getOneById, create, updateById, deleteById, } from "./controllers/planets.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
app.use(morgan("dev"));
app.use(express.json());
app.get("/api/planets", getAll);
app.get("/api/planets/:id", getOneById);
app.post("/api/planets", create);
app.put("/api/planets/:id", updateById);
app.delete("/api/planets/:id", deleteById);
app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
});
