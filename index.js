import express from 'express'
const app=express()
app.listen(8080,()=>
    {
        console.log("Sever started")
    })
 app.get("/",(req,res)=>
    {
        console.log(first)
    })   