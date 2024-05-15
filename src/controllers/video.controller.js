import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiErrorHandler.js"
import {ApiResponse} from "../utils/ApiResponseHandler.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinaryFileUpload.js"

// Controller function to : Get all video by the user
const getAllVideos = asyncHandler(async (req, res) => {
  //  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const userId = req.user?._id ;
    console.log("userId from req.user ::",userId)
    const videos = await User.aggregate([
        {
            $match:{
                _id :userId
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
                        }
                    }
                   } ,
                   /*  This is spitting out total likes , but it also removes all the other data feild 
                   {
                    $group:{
                        _id:null,Total_Channel_Like:{$sum:"$totalLikes"}
                    }
                }, */
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
                            Total_Channel_Like:1

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
                

            }
        }
    ])

    if(!videos?.length)
        throw new ApiError(400,"No Videos Found..!!")

    return res.status(201).json(new ApiResponse(200,videos,"Videos Fetched Successfully..!!"))
})

// Controller function to : Upload a video
const publishVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!title || !description)
        throw new ApiError(400,"All details are required .. !!")

 // Getting thumbnail/videoFile local path
 const thumbnailLocalPath =req.files?.thumbnail[0]?.path
const  videoLocalPath = req.files?.videoFile[0]?.path

 if(!thumbnailLocalPath || !videoLocalPath)
    throw new ApiError(400,"Add Thumbnail or Video File ")

// Uploading to Cloudinary
 const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

 const videoFile = await uploadOnCloudinary(videoLocalPath);

 console.log("Video File Details ",videoFile);
 
if(!thumbnail)
    throw new ApiError(400,"Thumbnail upload failed !!")

if(!videoFile)
    throw new ApiError(400,"Video upload failed !!")

const video = await  Video.create({
    title,
    description,
    thumbnail:thumbnail.url,
    videoFile:videoFile.url,
    isPublished:true,
    views:1,
    duration:videoFile.duration,
    owner :req.user?._id

})

if(!video){
    throw new ApiError(400,"Video wasn't saved on Database, Database Error")
}
return res.status(201).json( new ApiResponse(200,video,"Video uploaded Successfully !!"))

})


//Controller function to :Get a video by videoId
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await Video.findById(videoId)
    console.log("Video Data:: ",video)
    if(!video)
        throw new ApiError(400,"No video found with this id..!!")

    
    return res.status(200).json(new ApiResponse(200,video,"Video fetched Successfully ..!!"))
})

//Controller function to : Update A video 
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

     const thumbnailLocalPath = req.file?.path ;

     const {title,description}= req.body

     console.log("Thumbnail local path",thumbnailLocalPath)
     if(!thumbnailLocalPath)
        throw new ApiError(400,"Select a new thumbnail file ..!!")

     if(!title || !description)
        throw new ApiError(400,"Title or Description Missing !!")


    const video = await Video.findById(videoId)

     //checking if the Logged in user is the owner of the video
    if (video?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized..!! Only the owner of the Video can Update this Video ..!!");
    }

    video.title= title ;
    video.description=description

    const thumbnail= await uploadOnCloudinary(thumbnailLocalPath);

    if(!thumbnail.url){
        throw new ApiError(400,"Error While Uploading the Thumbnail on Cloudinary ")
      }
    
      video.thumbnail= thumbnail ;

      const updatedVideo = await video.save({validateBeforeSave:false})

      if(!updatedVideo)
        throw new ApiError(400,"Video was not updated , Error while Saving..!")


      return res.status(200).json(new ApiResponse(200,updatedVideo,"Video Updated SucessFully..!!!"))

})

//Controller function to : Delete a video 
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    console.log("VideoId::",videoId)

    const video = await Video.findById(videoId)

    console.log("Video Data ",video);

    if(!video){
        throw new ApiError(400,"Unable to find the video ..!!")
    }
    //checking if the Logged in user is the owner of the video
   if (video?.owner.toString() !== req.user?._id.toString()) {
       throw new ApiError(400, "Unauthorized..!! Only the owner of the Video can Delete this Video ..!!");
   }

   const deletedVideo = await Video.findByIdAndDelete(videoId)

   if(!deletedVideo)
    throw new ApiError(400,"Unable to delete video ..!!") 

   return res.status(200).json(new ApiResponse(201,deletedVideo,"Video Deleted Successfully ..!!"))




})

//Controller function to : Toggle Publish status of  video
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)

   

    if(!video){
        throw new ApiError(400,"Unable to find the video ..!!")
    }
    //checking if the Logged in user is the owner of the video
   if (video?.owner.toString() !== req.user?._id.toString()) {
       throw new ApiError(400, "Unauthorized..!! Only the owner of the Video can Update Publish Status of  this Video ..!!");
   }
    // toggleing 
   video.isPublished=!video.isPublished 
  const updatedVideo = await video.save({validateBeforeSave:false})

  if(!updatedVideo)
    throw new ApiError(400,"Publish status was not updated..!!")

  return res.status(200).json(new ApiResponse(200,updatedVideo,"Published Status Updated Successfully...!!"))

})

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
