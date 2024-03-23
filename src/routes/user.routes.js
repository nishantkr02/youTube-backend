import { Router } from "express"
import { registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const userRouter = Router()

//here before goint to the register user part we are using this middleware Funtion to handle the file upload .

userRouter.route("/register").post
(
    /*
    This is the part that varies when a single file from a single field, multiple files from single field, and single/multiple files from different fields are to be handled. For single file/single field uploads, we use

     .single(“field-name-of-type-file”)

   But here, we need to accept files from different fields and in different numbers. Hence we use,

  .field([{fieldName: String, maxCount: Int},])
   and pass an array of object(s) having the field name and number of files that can be uploaded using that field as an argument.

    */
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




 export default userRouter