import { Router } from "express";
import {verifyJwt} from "../middlewares/auth.middleware"
import { getVideoComments ,
        addComment,
        updateComment,
        deleteComment
        } from "../controllers/comment.controller.js";

const commentRouter = Router();

 // Getting all the comments on a  video 
 commentRouter.route("/all-comments").get(getVideoComments)

 //Adding a new Comment 
 commentRouter.route("/add-comment").post(verifyJwt,addComment)

 //Updating a comment
 commentRouter.route("/update-comment/:id").patch(verifyJwt,updateComment) 

 //Deleting a comment
 commentRouter.route("/delete-comment/:id").delete(verifyJwt,deleteComment)

export default commentRouter 