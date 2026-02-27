import express from "express";
import mongoose from "mongoose";
import expressLayouts from "express-ejs-layouts";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// ─── Fix __dirname for ES Modules ──────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── EJS + Layout Setup ─────────────────────────────────────────
app.use(expressLayouts);
app.set("layout", "layout");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ─── Middleware ─────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── MongoDB Connection ─────────────────────────────────────────
const dbConnect = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

// ─── Start Server ───────────────────────────────────────────────
const startServer = async () => {
  await dbConnect();
  app.listen(8080, () => console.log("Server started"));
};

// ─── Product Schema ─────────────────────────────────────────────
const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageurl: { type: String, required: true },
});

const productModel = mongoose.model("products", productSchema);

// ─── User Schema ────────────────────────────────────────────────
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  role: { type: String, required: true },
});

const userModel = mongoose.model("users", userSchema);

// ─── Product Routes ────────────────────────────────────────────
app.get("/", async (req, res) => {
  const products = await productModel.find();
  res.render("index", { products });
});

app.get("/add", (req, res) => {
  res.render("add");
});

app.post("/save", async (req, res) => {
  await productModel.create(req.body);
  res.redirect("/");
});

// ─── User Routes ───────────────────────────────────────────────
app.get("/users", async (req, res) => {
  const users = await userModel.find();
  res.render("users", { users });
});

app.get("/users/add", (req, res) => {
  res.render("user-add");
});

app.post("/users/save", async (req, res) => {
  await userModel.create(req.body);
  res.redirect("/users");
});

app.get("/users/:id/edit", async (req, res) => {
  const user = await userModel.findById(req.params.id);
  res.render("user-edit", { user });
});

app.post("/users/:id/save-user", async (req, res) => {
  await userModel.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/users");
});

app.get("/users/:id/delete", async (req, res) => {
  await userModel.findByIdAndDelete(req.params.id);
  res.redirect("/users");
});

// ─── Product :id Routes ─────────────────────────────────────────
app.get("/:id/edit", async (req, res) => {
  const product = await productModel.findById(req.params.id);
  res.render("edit", { product });
});

app.post("/:id/save-product", async (req, res) => {
  await productModel.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/");
});

app.get("/:id/delete", async (req, res) => {
  await productModel.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// ─── Start ─────────────────────────────────────────────────────
startServer();