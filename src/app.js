import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
//app.use() is used for configuration and setting up middleware 


//here we are using cors option , which means we are adding that we only want to accept from these origins only  ., originl means our path or link ,which we we add later in our project .
 app.use(cors({
    origin:process.env.CORS_ORIGIN ,
    credentials :true 

 }))


 // Data bahut jagha se aayega ,URl se aayega , Json se bhi aayega , kuch body se aayega like  kuch forms wwagairah submit karenge  , toh unlimited thore hi data aane de sakte hain kuch limit rakhan hai na uska , warna server crash ho jayega . So this is a security practice  .

 //ye json se data aana 
  app.use(express.json({limit:"32kb"}))

// jab url me data jana hai , to usko kaise encoding hoga , jo convert karta hai url ko , to wo bhi express ko batana hota  hai ki waha se jab data aayega toh usko kaise handle karna hai .
app.use(express.urlencoded({extended:true,limit:"16Kb"}))
app.use(bodyParser.json() )
// Ye files ko handle karne ke liye hai ,kai baar humlog kuch files ko apne hi server pe store rakhna chahte hain , toh uss case ye batane ke liye ha ki ek local folder hai public naam ka ,jisme ye sab storred hai 
app.use(express.static("public"))

//Cookie-parser ::  Mai mere server se user ke browser ki jo cookie hai usko access kar paau aur usko set bhi kar paau ,i.e cookie ke upar CRUD operations 
app.use(cookieParser());



//----------------- Routes ------------------------------
// User Router  :: 
 import userRouter from "./routes/user.routes.js";
 // app.use() --> Router -->> controller
  app.use("/api/v1/users",userRouter);
 
/* routes Declaration  :: 
//Intially we used  to implement the routes using  the ,app.get()  , but now => Cozz we were writing the app and the routes and the controller at the same place .But Now Since now we have moved the things to a separate files , so we have to write it as a middleware , using app.use() ;


Note  :  here whatever route is given will work as prefix and when it  will go to the  router file , that will be the actual name of the path   , like here for this
 e.g: http://localhost:8000//api/v1/users/register
 Here we can write multiple routes on top of the users prefix , those all will be written in the user.routes file .So hence it will make the file less clumsy in this app.js , just like we have routes for the user , we will have so many other routes for each and every model . 
 -----------------------------------------*/


// Tweet Router 
import tweetRouter from "./routes/tweet.routes.js"
app.use("/api/v1/tweets",tweetRouter) 

 //Comment Route 
 import commentRouter from "./routes/comment.routes.js";
 app.use("/api/v1/comments",commentRouter)








export {app}