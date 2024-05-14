import { Router } from "express";
import {
     publishVideo ,
    getAllVideos  ,
    updateVideo,
    togglePublishStatus,
    getVideoById,
    deleteVideo
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const videoRouter = Router()

//Upload a video 
videoRouter.route("/upload-video").post(verifyJWT,upload.fields(
    [
        {
            name:"thumbnail",
            maxCount:1
        },
        {
            name:"videoFile",
            maxCount:1
        }
    ]
),publishVideo)

//get all videos
videoRouter.route("/all-videos").get(verifyJWT,getAllVideos)

//get Video by Id 
videoRouter.route("/:videoId").get(verifyJWT,getVideoById)


// Update a video : title ,description and thumbnail
videoRouter.route("/update-video/:videoId").patch(verifyJWT,upload.single("thumbnail"),updateVideo)

// Deleteing a video
 videoRouter.route("/delete-video/:videoId").delete(verifyJWT,deleteVideo)

 //Toggle publish status 
 videoRouter.route("/toggle-publish-status/:videoId").patch(verifyJWT,togglePublishStatus)

 export default videoRouter ;