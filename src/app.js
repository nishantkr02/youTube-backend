import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
//app.use() is used for configuration and setting up middleware 


//here we are using cors option , which means we are adding that we only want to accept from these origins only  ., origins means our path or link ,which we we add later in our project .
 app.use(cors({
    origin:process.env.CORS_ORIGIN ,
    credentials :true 

 }))



  app.use(express.json({limit:"32kb"}))


app.use(express.urlencoded({extended:true,limit:"16Kb"}))
app.use(bodyParser.json() )

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

// Video Route 
 import videoRouter from "./routes/video.routes.js";
app.use("/api/v1/videos",videoRouter)


//Subscription Route 
import subscriptionRouter from "./routes/subscription.routes.js";
app.use("/api/v1/subscription",subscriptionRouter)

//Like Routes
import likeRouter from "./routes/like.routes.js";
app.use("/api/v1/likes",likeRouter)


//playlist Routes

import playlistRouter from "./routes/playlist.routes.js";
app.use("/api/v1/playlists",playlistRouter)

 

// Dashboard Router
import dashboardRouter from "./routes/dashboard.routes.js";
app.use("/api/v1/dashboard",dashboardRouter)


export {app}
