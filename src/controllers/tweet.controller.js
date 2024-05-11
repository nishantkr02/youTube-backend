import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {Like} from "../models/like.model.js"
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


    /*  This i need to check , if this is the right way or the aggregation 
    Query the Tweet collection to find all tweets by the user
    const userTweets = await Tweet.find({ owner: userId });
      */

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

                pipeline:[
                    //Adding the likedBy feild
                    {
                        $lookup:{
                            from:"likes",
                            localField:"_id",
                            foreignField:"tweet",
                            as:"likesList",
                           
                        }
                    },
                    {
                        $addFields:{
                            totalLikes:{
                                $size:"$likesList"
                            },
                //This is i am not so sure of .!! 
                            likedByCurrentUser:{
                                $cond:{
                                  if:{$in:[req.user?._id,"$likesList.likedBy"]},
                                  then:true,
                                  else:false
                                }
                              }
                        }
                    }
                    ,
               //Removing some feild
                    {
                        $project:{
                            content:1 ,
                            createdAt:1,
                            totalLikes:1,
                            likedByCurrentUser:1
                        }
                    }
                ]
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

//Controller function to : Update a tweet 
const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {newContent} = req.body ;
    
    if(!newContent)
    throw new ApiError(400,"Content can't be empty")


    //Note : Here in the routing , we should include the tweetId in the params 
    const id=new mongoose.Types.ObjectId(req.params) ; 
    console.log("incoming Params" ,id);


    const tweet = await Tweet.findById(id)
    
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    //checking if the Logged in user is the owner of the tweet 
    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized..!! Only the owner of the Tweet can Update this Tweet ..!!");
    }
    

/* const tweet = await Tweet.findByIdAndUpdate
    (
       tweetId,
        {
            $set:{
                content:newContent
            }
        },
        {new:true}
    ) */

   
        tweet.content=newContent ;
         await tweet.save({validateBeforeSave:false})

     return res.status(200)
     .json(new ApiResponse(200,tweet,"Tweet Updated SuccessFully"))

})

//Controller function to : To delete a tweet 
const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
   
    const id = new mongoose.Types.ObjectId(req.params) ;

    const tweet = await Tweet.findById(id)
    
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }
 //checking if the Logged in user is the owner of the tweet 
    if (tweet?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized..!! Only the owner of the Tweet can Update this Tweet ..!!");
    }
    const deletedTweet = await Tweet.deleteOne({_id:id});

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
