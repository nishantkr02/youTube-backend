import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getVideoComments ,
        addComment,
        updateComment,
        deleteComment
        } from "../controllers/comment.controller.js";

const commentRouter = Router();

 // Getting all the comments on a  video 
 commentRouter.route("/all-comments/:videoId").get(verifyJWT,getVideoComments)

 //Adding a new Comment 
 commentRouter.route("/add-comment/:videoId").post(verifyJWT,addComment)

 //Updating a comment
 commentRouter.route("/update-comment/:commentId").patch(verifyJWT,updateComment) 

 //Deleting a comment
 commentRouter.route("/delete-comment/:commentId").delete(verifyJWT,deleteComment)

export default commentRouter 