import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrorHandler.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryFileUpload.js";
 import { ApiResponse } from "../utils/ApiResponseHandler.js";

const registerUser =  asyncHandler(async (req,res)=>{
    
        // The controller Logic  ::

 //Step 1 : Get the data from the user :  req.body() :  Jab form   se ,ya direct json  se aa raha ho data . Par url se bhi aa sakta hia  . 
    
        const {fullName , email, username ,password} = req.body

     // console.log("The Sent Data by the User  :",req.body ) ;

//Step 2 : Validation  ::

       // Checking all the feilds at once  :
        if( [fullName ,email,username,password].some((field)=> 
        field?.trim()==="")  ){
            throw new ApiError(400,"All feilds are required !!") 
          }
 //Step 3 : Checking if the user aalready exist or not   ::
     const existingUser = await User.findOne({
        $or:[{ username }, { email }]
         })
      
         if(existingUser)
         throw new ApiError(409,"User with this Username or Email Alredy Exist ..!!! ")

 //Step 4 : checking for the files : multer gives use req.files
         let coverLocalPath ;
         if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0 )
         {
          coverLocalPath = req.files.coverImage[0].path 
         }

         console.log("Data Stores in Req.files  :: ",req.files) ;

      const avatarLocalPath = req.files?.avatar[0]?.path ;
      //avatar is a required Feild
      if(!avatarLocalPath)
      throw new ApiError(404,'Avatar Files is required');

// Step 5  :   Uploading on cloudinary : We have already written a Util for this     in  cloudinaryFileUpload.js
    const coverImage= await uploadOnCloudinary(coverLocalPath) ;
    const avatar = await uploadOnCloudinary(avatarLocalPath) ;
//Step 6 : Checking the avtar files is uploaded or not 
    if(!avatar){
      throw new ApiError(400,"Avatar File is Required");
    } 

//Step 7 : Entry in the Database  : User Model will be used here , as it it the only one who is taliking to the database .
 const user = await User.create({
      fullName,
      avatar:avatar.url ,
      coverImage :coverImage?.url || " " ,
      email,
      password,
      username:username.toLowerCase() 

    }) 


//Step 8 : Checking the user  creation and removinge sensitive feilds 
    
     //removing sensitive data 
   const createdUser=  await User.findById(user._id).select("-password -refreshToken ")

   if(!createdUser){
    throw new ApiError(500,"Something went wrong while registring the user ")
    }

//Step 9 : Sending the Api response :: using the util ApiResonse(statusCode,data,message="Sucess")

    return res.status(201).json(
      new ApiResponse(200,createdUser,"User Registered SucessFully !!")
    )



    })


export {registerUser};