import express, { request, response } from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
  createImage,
} from "./controllers/planets.js";
import { logIn, signUp, logOut } from "./controllers/users.js";
import auth from "./auth.js";
import "./passport.js";
dotenv.config();

/******* FILE upload *******/
import multer from "multer";
import { authorize } from "passport";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ".uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
/*******************************/

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(express.json());

app.get("/api/planets", getAll);
app.get("/api/planets/:id", getOneById);
app.post("/api/planets", create);
app.put("/api/planets/:id", updateById);
app.delete("/api/planets/:id", deleteById);

/*******************************/
app.post("/api/planets/:id/image", upload.single("image"), createImage);
/*******************************/

/********* ROUTES JWT **********************/
app.post("/api/users/login", logIn);
app.post("/api/users/signup", signUp);
app.get("/api/users/logout", auth, logOut);
/******************************************/

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
