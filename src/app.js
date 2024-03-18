import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express();
//app.use() is used for configuration and setting up middleware 


//here we are using cors option , which means we are adding that we only want to accept from these origins only  ., originl means our path or link ,which we we add later in our project .
 app.use(cors({
    origin:process.env.CORS_ORIGIN ,
    credentials :true 

 }))


 // Data bahut jagha se aayega ,URl se aayega , Json se bhi aayega , kuch body se aayega like  kuch forms wwagairah submit karenge  , toh unlimited thore hi data aane de sakte hain kuch limit rakhan hai na uska , warna server crash ho jayega . So this is a security practice  .

 //ye json se data aana 
  app.use(express.json({limit:"16kb"}))

// jab url me data jana hai , to usko kaise encoding hoga , jo convert karta hai url ko , to wo bhi express ko batana hota  hai ki waha se jab data aayega toh usko kaise handle karna hai .
app.use(express.urlencoded({extended:true,limit:"16Kb"}))

// Ye files ko handle karne ke liye hai ,kai baar humlog kuch files ko apn ehi server pe store rakhna chahte hain , toh uss case ye batane ke liye ha ki ek local folder hai public naam ka ,jisme ye sab storred hai 
app.use(express.static("public"))

//Cookie-parser ::  Mai mere server se user ke browser ki jo cookie hai usko access kar paau aur usko set bhi kar paau ,i.e cookie ke upar CRUD operations 
app.use(cookieParser());

















export {app}