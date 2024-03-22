import { Router } from "express"
import { registerUser } from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const userRouter = Router()

//here before goint to the register user part we are using this middleware Funtion to handle the file upload .

userRouter.route("/register").post
(
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