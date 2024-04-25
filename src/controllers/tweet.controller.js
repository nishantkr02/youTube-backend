import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


// Controller Function : TO Create a new Tweet ::: 
const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body 
    if(!content){
        throw new ApiError(400,"Tweet can't be empty")
    }
    const user = req.user ;

    //creation of tweet 
    const newTweet = await Tweet.create({
        owner :user._id ,
        content:content
    })
     await newTweet.save({validateBeforeSave:false});

     return res.status(201)
     .json(200,newTweet,"New Tweet Added Successfully")

})


// Controller Function : TO get all the tweets from a user :::>> 
const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const {userId}= req.user?._id
    const tweets = await User.aggregate([
        {
            $match :{
                _id:userId
            }
        },

        {
            $lookup :{
                from :"tweets",
                localField :"_id",
                foreignField:"content",
                as :"Tweets"
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
                username :1 ,
                avatar :1 ,
                totalTweets:1,


            }
        }
    ])

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
