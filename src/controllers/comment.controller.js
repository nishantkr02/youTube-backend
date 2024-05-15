import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiErrorHandler.js"
import {ApiResponse} from "../utils/ApiResponseHandler.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

//Controller function to : To get all the comments on the video 
const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit} = req.query
    const userId = req.user?._id
    const commentList = await Video.aggregate ([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(videoId)
            }
        } ,
        
       /*   This part is not working 
       {
            $skip:Number((page-1)*limit)
        },
        {
            $limit:2
        }, */

        {
            $lookup:{
                from:"comments",
                localField:"_id",
                foreignField:"video",
                as :"AllComments" ,

                //Getting the likes details
                pipeline:[
                    {
                        $lookup :{
                            from:"likes" ,
                            localField:"_id",
                            foreignField:"comment",
                            as:"likesList",
                            
                        },
                        
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
                    } ,
                    {
                        $project:{
                            owner:1,
                            content:1,
                            createdAt :1,
                            totalLikes:1,
                            likedByCurrentUser:1


                        }
                    }

                ]


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
        

    ])
    if(!commentList?.length)
    throw new ApiError(400,"No comments found or unable to fetch Comments")
     
    return res.status(200).json(new ApiResponse(201,commentList,"Comments fetched Successfully"))

})


//Controller function to : Adding a new commnet on the video 
const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const userId = req.user?._id ;
    
    const id = req.params.videoId
    //console.log("Id passed :",id);



    const {content} = req.body 

    if(!content)
    throw new ApiError(400,"Cannot left the content empty")

    const newComment = await Comment.create({
        content:content ,
        video: new mongoose.Types.ObjectId(id),
        owner :userId
    })

    if(!newComment){
        throw new ApiError(400,"Something went wrong while posting the comment")
    }

    return res.status(201).json(new ApiResponse(200,newComment,"Comment posted Successfully"))
})


// Controller function to : Updating the new comment on the video
const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {newContent} = req.body
    const commentId = new mongoose.Types.ObjectId(req.params.commentId );


    const comment = await Comment.findById(commentId)
    
    if (!comment) {
        throw new ApiError(404, "comment not found");
    }

    //checking if the Logged in user is the owner of the comment 
    if (comment?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized..!! Only the owner of the comment can Edit this comment ..!!");
    }



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

//Controller function to : Delete a tweet 
const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const commentId = new mongoose.Types.ObjectId(req.params.commentId );

    const comment = await Comment.findById(commentId)
    //console .log("Comment to be deleted :",comment)

    if (!comment) {
        throw new ApiError(404, "comment not found");
    }

    //checking if the Logged in user is the owner of the comment 
    if (comment?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized..!! Only the owner of the comment can Delete this comment ..!! ");
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);
    
    if(!deletedComment)
    throw new ApiError(400,"Unable to delete the comment ")

    return res.status(200).json(new ApiResponse(201,deletedComment,"Comment Deleted ..!!"))

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
