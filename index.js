import express from 'express'
const app=express()
app.set("view engine","ejs")
const products=[
    {id:1,name:"product 1",price:30},
    {id:2,name:"product 2",price:40},
    {id:3,name:"product 3",price:50}
]
//render html file with data to the client
app.listen(8080,()=>
    {
        console.log("Sever started")
    })
 app.get("/",(req,res)=>
    {
        // res.json({message:"Hello World..!!"})
        res.render("index",{name:"John"})
        //returns html file as output

        //html file created in the server
    })   


//page refreshes on every change making it slower    
app.get("/products",(req,res)=>
    {
        res.render("products",{products})
    })