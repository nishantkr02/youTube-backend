import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiErrorHandler.js"
import {ApiResponse} from "../utils/ApiResponseHandler.js"
import {asyncHandler} from "../utils/asyncHandler.js"


// Controller Function : TO Create a new Tweet ::: 
const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    console.log("incoming content",content);
    if(!content){
        throw new ApiError(400,"Tweet can't be empty")
    }
    const user = req.user ;

    //creation of tweet 
    const newTweet = await Tweet.create({
        owner :user._id ,
        content:content
    })
    console.log("New tweet Data",newTweet) ;
     //await newTweet.save({validateBeforeSave:false});

     return res.status(200)
     .json( new ApiResponse(200,newTweet,"New Tweet Added Successfully"))

})


// Controller Function : TO get all the tweets from a user :::>> 
const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const userId= req.user._id

   // console.log("Req.user :::> ", req.user)
    //console.log("UserId:: ",userId);

    const tweets = await User.aggregate([
        {
            $match :{

                _id:new mongoose.Types.ObjectId(userId)
                //_id:userId

            }
        },

        {
            $lookup :{
                from :"tweets",
                localField :"_id",
                foreignField:"owner",
                as :"Tweets" ,
            }
        },

        {
            $addFields:{
                totalTweets :{
                    $size :"$Tweets"
                }
            }
        },
        {
            $project :{
                fullName:1,
                totalTweets:1,
                Tweets:1


            }
        }
    ])

    if(!tweets?.length)
    throw new ApiError(404,"No tweets found or User Does not Exist")

console.log("All tweets data",tweets)

    // finally returning these all ::
    return res.status(201)
    .json(new ApiResponse(200,tweets,"Tweets fetched SuccessFully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {newContent} = req.body ;
    console.log(newContent)

    if(!newContent)
    throw new ApiError(400,"Content can't be empty")


    //Note : Here in the routing , we should include the tweetId in the params 
    const id=req.params ; //this is the problem , unable to get data from the params
    console.log("incoming Params" ,id);

    const tweetId = new mongoose.Types.ObjectId(id) ;
    
   
    console.log("TweetId:",tweetId);
    //const tweetUp=await Tweet.findById('662e4649658d6b106edae8a6');
    //console.log("tweet Found",tweetUp)

    const tweet = await Tweet.findByIdAndUpdate
    (
       tweetId,
        {
            $set:{
                content:newContent
            }
        },
        {new:true}
    )
    if(!tweet){
        throw new ApiError(400,"The Tweet was not updated") ;
    }
     return res.status(200)
     .json(new ApiResponse(200,tweet,"Tweet Updated SuccessFully"))

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const id= req.params ;
    const tweetId = new mongoose.Types.ObjectId(id) ;

    const deletedTweet = await Tweet.findOneAndDelete(tweetId);

    if(!deletedTweet){
        throw new ApiError(400,"Error While deleting the tweet , OR ALready Deleted ")
    }
    console.log("Deleted Tweet Data",deletedTweet);
    return res.status(200)
    .json(new ApiResponse(200,{},"Tweet Deleted ..!! "))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
