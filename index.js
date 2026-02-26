//render html file with data to the client

//  app.get("/",(req,res)=>
//     {
//         // res.json({message:"Hello World..!!"})
//         res.render("index",{name:"John"})
//         //returns html file as output

//         //html file created in the server
//     })   


//page refreshes on every change making it slower    
// app.get("/products",(req,res)=>
//     {
//         res.render("products",{products})
//     })
import expressLayouts from 'express-ejs-layouts'
import express from "express";
import mongoose from "mongoose";
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressLayouts)
app.set("layout","layout")
const dbConnect = async () => {
  await mongoose.connect("mongodb://localhost:27017/merndatabase");
};
const startServer = async () => {
  await dbConnect();
  app.listen(8080, () => console.log("Server started"));
};
const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageurl: { type: String, required: true },
});
const productModel = mongoose.model("products", productSchema);
app.get("/", async (req, res) => {
  const products = await productModel.find();
  // res.json(products);
  res.render("index", { products });
});

app.get("/add", (req, res) => {
  res.render("add");
});
app.post("/save", async (req, res) => {
  const body = req.body;
  const result = await productModel.create(body);
  res.redirect("/");
  // res.json({ message: "Product created" });
});

app.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const product = await productModel.findOne({ _id: id });
  res.render("edit", { product });
});

app.post("/:id/save-product", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  await productModel.findByIdAndUpdate(id, body);
  res.redirect("/");
});

app.get("/:id/delete", async (req, res) => {
  const id = req.params.id;
  await productModel.findByIdAndDelete(id);
  res.redirect("/");
});

startServer();