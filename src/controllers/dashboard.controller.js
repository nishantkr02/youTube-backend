import mongoose, { isValidObjectId } from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import { User } from "../models/user.model.js"
import {ApiError} from "../utils/ApiErrorHandler.js"
import {ApiResponse} from "../utils/ApiResponseHandler.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    if(!isValidObjectId(req.params.channelId))
        throw new ApiError(400,"Invalid Channel Id ..!!")

   const channelId= new mongoose.Types.ObjectId(req.params.channelId)
    
const totalVideos = await Video.find({owner:channelId}).count()
const totalSubscriber= await Subscription.find({channel:channelId}).count()


const channelViews = await Video.aggregate([
    {
        $match:{
            owner:channelId
        }
    },
    
    {
        $group :{
            _id:null,
            totalChannelViews:{ $sum :"$views"}
        }
           
    },
    {
        $project:{
            totalChannelViews:1
        }
    }
    

])

 const channelLikes= await Video.aggregate([
    {
        $match:{
            owner : channelId
        }
    },
    {
        $lookup:{
            from:"likes",
            localField:"_id",
            foreignField:"video",
            as:"Video_Likes" ,
        }
    },
    {
        $addFields:{
            likeCount:{
                $size:"$Video_Likes"
            }
        }
    },
    
    {   
    $group :{
        _id:null,
         totalChannelLikes:{ $sum :"$likeCount"}
         }

    },
    {
     $project:{
         totalChannelLikes:1
     }
 }
 ])
 const channelOwnerDetails = await User.findById(channelId).select("-password -refreshToken -watchHistory -updatedAt -_id -fullName ")

// Just giving out the data in the simplest form for the end user, or the front end team .
 let totalViews=channelViews[0]?.totalChannelViews
 let totalLikes =channelLikes[0]?.totalChannelLikes

 //console.log("totalViews and Total Likes :: ",totalViews,totalLikes)

 if(!totalLikes)
    totalLikes=0 

if(!totalViews)
    totalViews=0



 return res.status(200).json(new ApiResponse(200,{channelOwnerDetails,totalVideos,totalSubscriber,totalViews,totalLikes},"Channel Details Fetched ..!"))

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    if(!isValidObjectId(req.params.channelId))
        throw new ApiError(400,"Invalid Channel Id ..!!")

    const channelId = new mongoose.Types.ObjectId(req.params.channelId)
   
    const videos = await User.aggregate([
        {
            $match:{
                 _id :channelId
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"_id",
                foreignField:"owner",
                as:"uploadedVideos" ,
                pipeline:[
                    //Add like and comment lookup to get like count and commnet count
                   {
                        $lookup:{
                            from:"likes",
                            localField:"_id",
                            foreignField:"video",
                             as:"videoLikes"
                        }
                   } ,
                     {
                        $lookup:{
                            from:"comments",
                            localField:"_id",
                            foreignField:"video",
                             as:"videoComments"
                        }
                   } ,
                   {
                    $addFields:{
                        totalLikes:{
                            $size:"$videoLikes"
                        },
                        totalComments:{
                            $size:"$videoComments"
                        },
                        //This is a bit tricky , not sure  
                        likedByCurrentUser:{
                            $cond:{
                                if:{$in:[req.user?._id,"$videoLikes.likedBy"]},
                                then:true,
                                else:false
                            }
                            }
                    }
                   } ,
                    
                    {
                        $project:{
                            title:1,
                            description:1,
                            videoFile:1,
                            thumbnail:1 ,
                            duration:1,
                            views:1,
                            isPublished:1,
                            totalLikes:1 ,
                            totalComments:1 ,
                            likedByCurrentUser:1

                        }
                    }
                ]
            }
        },
        
        {
            $addFields:{
                totalVideos :{
                    $size:"$uploadedVideos"
                }
            }
        },
        {
            $project:{
                username:1,
                totalVideos:1 ,
                uploadedVideos:1,
                Total_Channel_Like:1

            }
        }
    ])

    if(!videos?.length)
        throw new ApiError(404,"No Videos Found ...!")

    return res.status(200).json(new ApiResponse(200,videos,"Successfully Fetched all the videos by the channel..!"))
})

export {
    getChannelStats, 
    getChannelVideos
    }