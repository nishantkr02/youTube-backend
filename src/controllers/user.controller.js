import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrorHandler.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryFileUpload.js";
 import { ApiResponse } from "../utils/ApiResponseHandler.js";

const registerUser =  asyncHandler(async (req,res)=>{
      /* res.status(200).json({
        message:"He there .. Testing this on PostMan" }) */
        // The controller Logic  ::

 //Step 1 : Get the data from the user :  req.body() :  Jab form   se ,ya direct json  se aa raha ho data . Par url se bhi aa sakta hia  . 
    
        const {fullName , email, username ,password} = req.body
       // console.log("Sent Username Data  :",username) ;

//Step 2 : Validation  ::
        /*  Basic Method  ::Have to write again and again for every feild .
        if(fullName===""){
           throw new ApiError(400,"FullName is required !!")
         }*/

       // Checking all the feilds at once  :
        if( [fullName ,email,username,password].some((feild)=> 
        feild?.trim()==="")  ){
            return new ApiError(400,"All feilds are required !!") 
          }
 //Step 3 : Checking if the user aalready exist or not   ::
     const existingUser = User.findOne({
        $or:[{ username }, { email }]
         })
      
         if(existingUser)
         throw new ApiError(409,"User with this Username or Email Alredy Exist ..!!! ")

 //Step 4 : checking for the files : multer gives use req.files
      const avatarLocalPath = req.files?.avatar[0]?.path ;
      const coverLocalPath =req.files?.avatar[0]?.path ;

      if(!avatarLocalPath)
      throw new ApiError(404,'Avtar Files is required');

// Step 5  :   Uploading on cloudinary : We have already written a Util for this     in  cloudinaryFileUpload.js
    const avatar = await uploadOnCloudinary(avatarLocalPath) ;
    const coverImage= await uploadOnCloudinary(coverLocalPath) ;
//Step 6 : Checking the avtar files is uploaded or not 
    if(!avatar){
      throw new ApiError(400,"Avtar File is Required");
    } 

//Step 7 : Entry in the Database  : User Model will be used here , as it it the only one wo is taliking to the database .
 const user = await User.create({
      fullName,
      avatar:avatar.url ,
      coverImage :coverImage?.url || " " ,
      email,
      username:username.toLowerCase() 

    }) 


//Step 8 : Checking the user  creation and removinge sensitive feilds 
    
     //removing sensitive data 
   const createdUser=  await User.findById(user._id).select("-password -refreshToken")

   if(!createdUser){
    throw new ApiError(500,"Something went wrong while registring the user ")
    }

//Step 9 : Sending the Api response :: using the util ApiResonse(statusCode,data,message="Sucess")

    return res.status(201).json(
      new ApiResponse(200,createdUser,"User Registered SucessFully !!")
    )



    })


export {registerUser};