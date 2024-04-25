import { Router } from "express"
import { createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
} from "../controllers/tweet.controller.js" 
import { verifyJWT } from "../middlewares/auth.middleware.js";

const tweetRouter = Router() ;

// Creating a new Tweet 
tweetRouter.route("/new-tweet").post(verifyJWT,createTweet);

// Get all the tweets from the user 
 tweetRouter.route("/all-tweets").get(verifyJWT,getUserTweets)

 //update a tweet
  tweetRouter.route("/update-tweet").patch(verifyJWT,updateTweet)

  // delete a tweet 
  tweetRouter.route("/delete-tweet").delete(verifyJWT,deleteTweet)

  export default tweetRouter 

