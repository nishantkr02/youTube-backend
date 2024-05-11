import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js"

import {verifyJWT} from "../middlewares/auth.middleware.js"

const likeRouter = Router();
// Apply verifyJWT middleware to all routes in this file
likeRouter.use(verifyJWT); 


//Routes : 
likeRouter.route("/toggle-like/v/:videoId").post(toggleVideoLike);

likeRouter.route("/toggle-like/c/:commentId").post(toggleCommentLike);

likeRouter.route("/toggle-like/t/:tweetId").post(toggleTweetLike);

likeRouter.route("/liked-videos").get(getLikedVideos);

export default likeRouter