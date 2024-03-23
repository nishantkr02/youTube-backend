// require ('dotenv').config({path:'./env'}) :: This breaks the consistency.
import dotenv from "dotenv"
 import dbConnect from "./db/dbConnect.js"
 import {app} from './app.js'

 dotenv.config({path:'./.env'})



 
 // => DB Connection ::: M-1 :::::::::::::: Totally Fine but makes index.js a bit messy 
/*  ;(async ()=>{
    try{ 
         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        //Adding Listners :Now app can listen to various events: app.on("",()=>{}) 
         app.on("error",(error)=>{
            console.log("Error :",error);
            throw error ;
         })

         //Strating listening the server request :
         app.listen(process.env.PORT,()=>{
            console.log(`Server is listening to the  port : ${process.env.PORT}`)
         })

    }catch(error){
        console.error(); // == console.log(error)
        throw err 
    }
 })()
 
 Note  : Decalring the function and calling it  : This is not a profectional approach , instead we will use iffi ., see the above function 
E.g : function connectDB(){} // connectDB();
iffi =>  ;(defination)(call) ::>  ;(async ()=>{})()
These imports were needed ::
import mongoose from "mongoose"
import {DB_NAME} from "./constants"
import express from "express";
  const app  = express() 
 */







 //=> DB Connection ::: M-2 :::::::  Import the separately written function and execute it .

 dbConnect()
 .then(()=>{
   app.on("error",(error)=>{
      console.log("DataBase Error Occured :",error);
      throw error ;
   })
   app.listen(process.env.PORT || 8000,()=>{
      console.log("Server is listening to the port :",process.env.PORT)
   })
 })
 .catch((error)=>{
   console.log("MongoDb connection Failed ::: ",error);
 })

