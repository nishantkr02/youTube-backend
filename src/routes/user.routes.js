import { Router } from "express"
import { changeCurrentPassword,
getCurrentUser,
getUserChannelProfile,
getWatchHistory,
loginUser,
logoutUser,
refreshAccessToken,
registerUser,
updateAccountDetails,
updateAvatar,
updateCoverImage } from "../controllers/user.controller.js"

import { upload } from "../middlewares/multer.middleware.js"
import { User } from "../models/user.model.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const userRouter = Router()

//Registering the user and using the niddleware to handle the file upload  .

userRouter.route("/register").post
(
    //injecting the middlware 
    upload.fields([
        {
            name :"avatar",
            maxCount:1 ,

        },
        {
            name :"coverImage",
            maxCount:1 ,
        }
    ]),
    registerUser
)
/*
    This is the part that varies when a single file from a single field, multiple files from single field, and single/multiple files from different fields are to be handled. For single file/single field uploads, we use

     .single(“field-name-of-type-file”)

   But here, we need to accept files from different fields and in different numbers. Hence we use,

  .field([{fieldName: String, maxCount: Int},{},{}....])
   and pass an array of object(s) having the field name and number of files that can be uploaded using that field as an argument.

    */

    //Logging In the user   ::
   userRouter.route("/login").post(loginUser)


   //Logging out the user and adding the middleware : 
   userRouter.route("/logout").post(verifyJWT,logoutUser)

   //refreshing the access token  ::
   userRouter.route("/refresh-token") .post(refreshAccessToken)

    //changing the current password 
   userRouter.route("/change-password").post(verifyJWT,changeCurrentPassword)

    //
    userRouter.route("/current-user").get(verifyJWT,getCurrentUser)

    // Updating the account details
    userRouter.route("/update-details")
    .patch(verifyJWT,updateAccountDetails)

    // Updating the avatar
    userRouter.route("/update-avatar")
    .patch(verifyJWT,upload.single("avatar"),updateAvatar) ;

    // Updating the Cover Inage
       userRouter.route("/update-cover-image")
       .patch(verifyJWT,upload.single("coverImage"),updateCoverImage) ;

    // Getting the channel profile info  : We are using the pramas here so this is different 
    userRouter.route("/c/:username").get(verifyJWT,getUserChannelProfile) ;

    // Get watch history
    userRouter.route("/watch-History").get(verifyJWT,getWatchHistory)

  



 export default userRouter