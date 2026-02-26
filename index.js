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


import express from 'express'
import mongoose from 'mongoose'
const app=express()
app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const dbConnect=async()=>{
    await mongoose.connect("mongodb://localhost:27017/merndatabase")
}    
const startServer=async()=>{
    dbConnect()
    app.listen(8080,()=>
        {
            console.log("server started")
        })
}
const productSchema=mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:String,required:true},
    imageUrl:{type:String,required:true}
})
const productModel=mongoose.model("products",productSchema)

app.get("/",async(req,res)=>{
    const products=await productModel.find();
    res.json(products);
})
app.post("/",async(req,res)=>{
    const body=req.body;
    const result=await productModel.create(body);
    res.json({message:"Product Added"});
})
startServer();