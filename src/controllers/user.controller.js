import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrorHandler.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryFileUpload.js";
 import { ApiResponse } from "../utils/ApiResponseHandler.js";

//Method To generate Access and Refresh Tokens ::
 const generateTokens = async (userId)=>{
  try{
      const user = await User.findById(userId)
     const accessToken = user.generateAccessToken()
     const refreshToken = user.generateRefreshToken()

     user.refreshToken=refreshToken ; //Adding value to user object
     await user.save({ValiditeBeforeSave:false}); //This is from mongoDb
     return {accessToken,refreshToken};

     
  }catch(error){
      throw new ApiError(500," Something Went Wrong While Generating the Refresh and Access Tokens " )
  }
 }



  
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


const loginUser = asyncHandler(async (req,res)=>{
  //step 1: Fetch Data from requet body 
  const [username,email,password]=req.body ;

  //step 2 : Verification of the data 
  if(!username && ! email)
  throw new ApiError(400,"Username or Email and password  is required !!")

  //Step 3 : Finding the user  : On the basis of username or email 
 const user = User.findOne({
    $or:[{ username }, { email }]
  })

  if(!user){
    throw new ApiError(404, "User Does Not Exist ..!!")
  }

//Step 4 : checking the password is correct or not  
 const isPasswordValid = await user.isPasswordCorrect(password)
 if(!isPasswordValid){
  throw new ApiError(401, "Invalid User Credentials ...!!")
}
//Step 5 : Generating the Tokens  :: //using the method that I wrote earlier 
 const {accessToken,refreshToken}=await generateTokens(user._id)

//  Udating the user feild and hiding some data before giving out the response .
const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


// Sending Cookies :
const options = {
  httpOnly :true ,
  secure :true 
}


//returning the final response  response
return res
 .status(200)
 .cookie("accessToken",accessToken,options)
 .cookie("refreshToken",refreshToken,options)
 .json(
  new ApiResponse(
    200,
    {
      //This is the case when the user himself wantto save the tokens for himself 
    user : loggedInUser,accessToken,refreshToken
    },
    "User Logged In SuccesFully "
  )
 )

})

export {
  registerUser ,
  loginUser ,
};