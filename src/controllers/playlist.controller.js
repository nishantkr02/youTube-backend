import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiErrorHandler.js"
import {ApiResponse} from "../utils/ApiResponseHandler.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"

// Controller Function : To create a playlist 
const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist

    if(!name || ! description)
        throw new ApiError(400,"All Feilds are required..! Either name or description missing .!! ")

    const userId = req.user?._id
    if(!userId)
        throw new ApiError(400,"Unauthorized ..!! , kindly Login to Create A Playlist .")
    const newPlayList = await Playlist.create({
        name:name,
        description:description,
        owner:userId ,
    })

    if(!newPlayList)
        throw new ApiError(400,"Unable to create the Playlist ..!!")


    return res.status(200).json(new ApiResponse(201,newPlayList,"Playlist Created SuccessFully ..!!"))





})

// Controller Function : To get all Playlists by user
const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user._id

    if(!isValidObjectId(userId))
        throw new ApiError(400,"Invalid User Id..!!")

    //TODO: get user playlists
    const playlists = await Playlist.aggregate([
        {
            $match:{
                owner:userId
            }
        },
        // Now I am just Showinng off
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner_Details" ,
                pipeline:[
                    {
                        $project:{
                            username:1,
                            avatar:1 ,
                            _id:0
                            
                        }
                    }
                ]
            }
        },
        {
            $project:{
                name:1,
                description:1,
                owner_Details:1,
                videos:1,
                owner:1 ,
                owner_Details:1

               
            }
        }
    ])

    if(!playlists?.length)
        throw new ApiError(400,"No Playlists Found by the current User ..!")

    return res.status(200).json(new ApiResponse(200,playlists,"SuccessFully  Fetched the Playlists by the user ..!! "))

})

// Controller Function : To to get playlist details bu Id
const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!isValidObjectId(playlistId))
    throw new ApiError(400,"Playlist id is not valid")

    const playlist= await Playlist.findById(playlistId)
    if(!playlist)
        throw new ApiError(404,"No playlist Found with this id ")

    return res.status(200).json(new ApiResponse(200,playlist,"Successfully found the playlist ..!!"))
})

// Controller Function : To add a video to the playlist 
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    const newVideo = await Video.findById(videoId);
    
    if(!newVideo)
        throw new ApiError(404,"No videos found with the given id ")

    const playlist = await Playlist.findById(playlistId)
    
    if (!playlist) {
        throw new ApiError(404, "Playlist  not found");
    }

    //checking if the Logged in user is the owner of the playlist 
    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized..!! Only the owner of the Playlist can add videos to the playlist ..!!");
    }

const updatedPlaylist = await Playlist.updateOne({"_id":playlistId},{
    $push:{
        videos:{
            $each:[newVideo],
            $sort:{title:1}
        }

    }
})

if(!updatedPlaylist)
    throw new ApiError(400,"Cannot add this video to the playlist  ..!!")


return res.status(200).json(new ApiResponse(200,updatedPlaylist,"Successfully Added the video to the playlist ..!!"))


})

// Controller Function : To Remove a video from the playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    // TODO: remove video from playlist
    const playlist = await Playlist.findById(playlistId)

    const removedVideo = playlist?.videos.includes(videoId)
    console.log("Video details",playlist.videos)
    console.log("Video Present :::",removedVideo)
    if(!removedVideo)
        throw new ApiError(400,"Video Not Found or Already Removed ..!!")

    
    if (!playlist) {
        throw new ApiError(404, "Playlist  not found");
    }

    //checking if the Logged in user is the owner of the playlist 
    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized..!! Only the owner of the Playlist can Remove  videos from a playlist  ..!!");
    }

const updatedPlaylist = await Playlist.updateOne({"_id":playlistId},{
    $pull:{
        videos:videoId
    }
})

if(!updatedPlaylist)
    throw new ApiError(400,"Cannot Remove this video to the playlist  ..!!")


return res.status(200).json(new ApiResponse(200,updatedPlaylist,"Successfully Removed the video to the playlist ..!!"))


})


// Controller Function : To delete the entire playlist 
const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    const playlist = await Playlist.findById(playlistId)
    
    if (!playlist) {
        throw new ApiError(404, "Playlist  not found");
    }

       

    //checking if the Logged in user is the owner of the playlist 
    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized..!! Only the owner of the Playlist can delete it ..!!");
    }

    const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId)

    if(!deletedPlaylist)
        throw new ApiError(400,"Unable to delete the Playlist..!!")

    return res.status(200).json(new ApiResponse(200,deletedPlaylist,"Playlist deleted Successfully ...!!!"))



})
// Controller Function : To Update the details of the Playlist 
const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    //TODO: update playlist
    if(!name || ! description )
        throw new ApiError(400,"All Feilds are Required ..!!")

   
    const playlist = await Playlist.findById(playlistId)

    /* console.log("owner without toString Method ::> ",playlist?.owner)
     // new ObjectId('662e406e3b21b43ee826433f')
    console.log("owner with   toString Method ::> ",playlist?.owner.toString())
    //662e406e3b21b43ee826433f */

    if (!playlist) {
        throw new ApiError(404, "Playlist  not found");
    }

    //checking if the Logged in user is the owner of the playlist 
    if (playlist?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Unauthorized..!! Only the owner of the Playlist can delete it ..!!");
    }


  

    playlist.name = name 
    playlist.description= description

    const updatedPlaylist= await playlist.save({validateBeforeSave:false})

    if(!updatedPlaylist)
        throw new ApiError(400,"Unable to update the Playlist ..!!")

    return res.status(200).json(new ApiResponse(200,updatedPlaylist,"SuccessFully updated the Playlist details ..!!"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
