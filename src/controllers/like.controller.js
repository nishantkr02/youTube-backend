import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import { Video } from "../models/video.model.js"
import {Tweet} from "../models/tweet.model.js"
import { Comment } from "../models/comment.model.js"
import {ApiError} from "../utils/ApiErrorHandler.js"
import {ApiResponse} from "../utils/ApiResponseHandler.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
     const userId = req.user?._id ;
    if(!videoId || !userId)
        throw new ApiError(400,"Unable to get videoId or userId")

    const video = await Video.findById(videoId);
    if(!video)
        throw new ApiError(404,"No Video with this Id  exists..!!")

      const liked = await Like.findOne({likedBy:userId,video:videoId})

       if(!liked)
        {
            const newLike = await Like.create({
                video:videoId,
                likedBy :userId
            })

            if(!newLike)
                throw new ApiError(400,"Unable to toggle like ..!")

            return res.status(201).json(new ApiResponse(200,newLike,"You Liked this Video ..!!"))
        }
        else{
            const removeLike = await Like.findOneAndDelete({likedBy:userId,video:videoId})

            if(!removeLike)
                throw new ApiError(400,"Failed ..!! Unable to Toggle Like.")

            return res.status(201).json(new ApiResponse(201,{},"You Unliked this video ..!!"))
            
        }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    const userId = req.user?._id ;
    if(!commentId || !userId)
        throw new ApiError(400,"Unable to get commentId or userId")

    const comment = await Comment.findById(commentId);
     if(!comment)
        throw new ApiError(404,"No Comment with this Id  exists..!!")


      const liked = await Like.findOne({likedBy:userId,comment:commentId})

       if(!liked)
        {
            const newLike = await Like.create({
                comment:commentId,
                likedBy :userId
            })

            if(!newLike)
                throw new ApiError(400,"Unable to toggle like ..!")

            return res.status(201).json(new ApiResponse(200,newLike,"You Liked this Comment ..!!"))
        }
        else{
            const removeLike = await Like.findOneAndDelete({likedBy:userId,comment:commentId})

            if(!removeLike)
                throw new ApiError(400,"Failed ..!! Unable to  Like this Comment .")

            return res.status(201).json(new ApiResponse(201,{},"You Unliked this Comment ..!!"))
            
        }




})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const userId = req.user?._id ;
    if(!tweetId || !userId)
        throw new ApiError(400,"Unable to get tweetId or userId")

    const tweet = await Tweet.findById(tweetId);
    if(!tweet)
        throw new ApiError(404,"No Tweet with this Id  exists..!!")

      const liked = await Like.findOne({likedBy:userId,tweet:tweetId})

       if(!liked)
        {
            const newLike = await Like.create({
                tweet:tweetId,
                likedBy :userId
            })

            if(!newLike)
                throw new ApiError(400,"Unable to toggle like ..!")

            return res.status(201).json(new ApiResponse(200,newLike,"You Liked this tweet ..!!"))
        }
        else{
            const removeLike = await Like.findOneAndDelete({likedBy:userId,tweet:tweetId})

            if(!removeLike)
                throw new ApiError(400,"Failed ..!! Unable to  Like this comment .")

            return res.status(201).json(new ApiResponse(201,{},"You Unliked this tweet ..!!"))
            }

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId= req.user?._id
     
    const videos = await Like.aggregate([
        {
            $match:{
                likedBy:userId
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"likedVideos" ,

                pipeline:[
                    {
                        $project:{
                            title:1 ,
                            description:1,
                            videoFile:1,
                            thumbnai:1,
                            duration:1
                        }
                    }
                ]


            }
        } ,
        {
            $addFields:{
                totalLikedVideoByUser :{
                    $size:"$likedVideos"
                }
            }
        },
        {
            $project:{
                likedBy:1,
                likedVideos :1,
                totalLikedVideoByUser:1 
            }
        }
        
    ])
    if(!videos?.length)
        throw new ApiError(400,"Unable to fetch Liked video List ")

    return res.status(201).json(new ApiResponse(200,videos,"Successfully Fetched Liked Videos list by the User !!") )
 
       

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}