import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

//Getting all the comments on the video 
const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const commentList = await Video.aggregate ([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(videoId)
            }
        } ,

        {
            $lookup:{
                from:"comments",
                localFeild:"_id",
                foreignField:"video",
                as :"AllComments"

            }
        },

        {
            $addFields:{
                totalComments :{
                    $size :"$AllComments"
                }
            }
        },
          

       
        {
            $project :{
                title:1,
                description:1,
                AllComments:1


            }
        },
/* use $sort, $skip, $limit (in that order) in an aggregation pipeline to retrieve Y number of documents for the current page Z, use 0 as the first page in your code, use Z+1 as the page number in the page slider.
$sort: onsomefield(s)here,
$skip: Z*Y,
$limit: Y, */
        {
            $skip:(page-1)*limit
        },
        {
            $limit:limit
        },

    ])
    if(!commentList)
    throw new ApiError(400,"No comments found or unable to fetch Comments")
     
    return res.status(200).json(new ApiResponse(201,commentList,"Comments fetched Successfully"))

})


//Adding a new commnet on the video 
const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {userId} = req.user?._id ;
    const videoId = req.params 
    const {content} = req.body 

    if(!content)
    throw new ApiError(400,"Cannot left the content empty")

    const newComment = await Comment.create({
        content:content ,
        video:videoId ,
        owner :userId
    })

    if(!newComment){
        throw new ApiError(400,"Something went wrong while posting the comment")
    }

    return res.status(201).json(new ApiResponse(200,newComment,"Comment posted Successfully"))
})


//Updating the new comment on the video
const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {newContent} = req.body
    const commentId = new mongoose.Types.ObjectId(req.params );

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content:newContent
            }
        },
        {new:true}
    )

    if(!updateComment)
    throw new ApiError(400,"Error..!! Comment was not updated")

    return res.status(200).json(new ApiResponse(200,updatedComment,"Comment updated ..!!  "))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const commentId = new mongoose.Types.ObjectId(req.params );
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if(!deletedComment)
    throw new ApiError(400,"Unable to delete the comment ")

    return res.status(200).json(new ApiResponse(201,{},"Comment Deleted ..!!"))

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
