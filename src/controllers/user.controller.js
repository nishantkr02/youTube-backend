import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiErrorHandler.js"
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinaryFileUpload.js";
 import { ApiResponse } from "../utils/ApiResponseHandler.js";
 import jwt  from "jsonwebtoken";
 
//Helper Function : To generate Access and Refresh Tokens ::
 const generateTokens = async (userId)=>{
  try{
      const user = await User.findById(userId)
     const accessToken = user.generateAccessToken()
     const refreshToken = user.generateRefreshToken()

  //adding and saving the encoded refresh token to the user in the db also 
     user.refreshToken=refreshToken ;
     await user.save({validateBeforeSave:false}); 

     return {accessToken,refreshToken};

     
  }catch(error){
      throw new ApiError(500," Something Went Wrong While Generating the Refresh and Access Tokens " )
  }
 }



 // Controller Function : Registering New User :: 
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

//Controller Function : Logging in  the user ::>
const loginUser = asyncHandler(async (req,res)=>{
  //step 1: Fetch Data from requet body 
  const {username,email,password}=req.body ;

  //step 2 : Verification of the data 
  if(!username && ! email)
  throw new ApiError(400,"Username or Email and password  is required !!")

  //Step 3 : Finding the user  : On the basis of username or email 
 const user = await User.findOne({
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

// Controller Function :Logging Out Controller Function:::
 const logoutUser = asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
    //find by this
      req.user._id, 

      //what do you want to update
      {
        $set:{
          refreshToken:undefined
        }
      },
      {
        new:true
      }
    )

    const options = {
      httpOnly :true ,
      secure :true 
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged OUt !"))
 })

// Controller Function :To refresh the access Token ::>> 
 const refreshAccessToken = asyncHandler(async (req,res)=>{

   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken 

   if(incomingRefreshToken){
      throw new ApiError(401,"Unauthorized Request")
   }
    
//Wrapping this whole thing in the try catch block , is just for the sake of being cautious :::::
 try {
  
     //Verifying the incoming token  :
     const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET 
     ) 
  
     //since refresh token gives us the _id , we can use it to search for the user 
     const user = await User.findById(decodedToken._id) ;
     
    if(!user){
      throw new ApiError(401, "Invalid refresh Token ..!!")
    }
  
    //Checking if the incoming refreshToken , matches with the refreshToken stored in the db , for that user 
    if(incomingRefreshToken!==user.refreshToken)
      throw new ApiError(401,"Refresh Token is expired or used");
  
    //Now generating the new refresh and acess tokens ::::::>>>
           const {accessToken,newRefreshToken } = await generateTokens(user._id)
  
           const options ={
            httpOnly:true ,
            secure:true
          }
        
            return res
            .status(200)
            .cookies("accessToken",accessToken,options)
            .cookies("refreshToken",newRefreshToken,options)
            .json( new ApiResponse(201,
              {accessToken,refereshToken:newRefreshToken},
              "SucessFully updated the access tokens "))
} 
catch (error) {
  throw new ApiError(401,error?.message ||"Invalid refresh Token ")
  
}






   
 })

//Controller Function : To change  the current password
const changeCurrentPassword = asyncHandler(async(req,res)=>{
    const {oldPassword , newPassword}= req.body ;

    /* There might be the case when we ask the user to reenter the password 
    const {oldPassword , newPassword,confirmNewPassword}= req.body ;
    if(!(newPassword===confirmNewPassword)){
      throw new ApiError(400,"Password doen't match ")
    }
    */


    const userId = req.user?._id ;
    const user = await User.findById(userId)

    const isPasswordCorrect= await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
      throw new ApiError(400,"Invalid Password");
    }
    //assignig new password to user feild and saving it to the db also .
    user.password= newPassword ;
       await user.save({validateBeforeSave:false})


    return res
       .status(200)
       .json(new ApiResponse(200,{},"Password Changed Successfully "))

})

// Controller Function : To get the current user if the user is loggged in  :::>>
const getCurrentUser = asyncHandler(async(req,res)=>{
  //Note  : While hitting this endpoint , we will use the authMiddleware , which puts the whole user in the request body .
  return res
  .status(200)
  .json(new ApiResponse(200,req.user,'Current user fetched Successfully'))
})



// Controller Function : To Update the User Account Info ::
const updateAccountDetails = asyncHandler(async(req,res)=>{

// Note : We can decide which feilds we are allowing the users to update , in case of files , we shold make a separate controller function for them , so here we are updating only the text feilds .

  const {fullName,email}= req.body
  if(!fullName && !email){
    throw new ApiError(400 , "All Feilds are required ")
  }

  const userId=req.user?._id
  const user =await  User.findByIdAndUpdate
  (  
    userId,
    {
      $set:{
        fullName:fullName,
        email:email
      }
     },
     { new:true} // updated info in returned 

  ).select("-password") //removing the password before returning to the user 

  return res.status(200)
  .json(new ApiResponse(200,user,"User account details updated"))


})

// Controller Function : To Update the Avatar Image ::>>
const updateAvatar = asyncHandler(async(req,res)=>
{
   const avatarLocalPath= req.file?.path
  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is missing ")
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if(!avatar.url){
    throw new ApiError(400,"Error While Uploading the Avtar on Cloudinary ")
  }

  const userId= req.user?._id
 const user= await User.findByIdAndUpdate
  ( userId ,
    {
       $set :{
         avatar:avatar.url,
         }
    },
    {new:true}

  ).select("-password")

  return res.status(200)
  .json(new ApiResponse(200,user,"Avtar image changed SuccessFully"))

})

// Controller Function : To Update the Cover Image ::>>
const updateCoverImage = asyncHandler(async(req,res)=>
{
   const coverLocalPath= req.file?.path
  if(!coverLocalPath){
    throw new ApiError(400,"Cover Image file is missing ")
  }

  const coverImage = await uploadOnCloudinary(coverLocalPath);
  if(!coverImage.url){
    throw new ApiError(400,"Error While Uploading the Cover File on Cloudinary ")
  }

  const userId= req.user?._id
 const user= await User.findByIdAndUpdate
  ( userId ,
    {
       $set :{
        coverImage:coverImage.url,
         }
    },
    {new:true}

  ).select("-password")

  return res.status(200)
  .json(new ApiResponse(200,user,"Cover image changed SuccessFully"))

})

// Controller Function : To get all the info of a user :
const getUserChannelProfile=asyncHandler(async (req,res)=>{
  const {username}=req.params
  if(!username?.trim()){
    throw new ApiError(400,"Username is missing");
  }

 const channelInfo  = await User.aggregate(
  [

  {
    $match:{
      username:username?.toLowerCase()
    },
    
  },
   //Finding the number of subscriber a channel/user have 
  {
    $lookup:{
      from:"subscriptions",
      localField:"_id",

      //We will look for the docs for which channel name has been present , then these dosc will  gives us the number of docs/ users subscribed to that channel .
      foreignField:"channel",
      as:"subscribers"
      
    }
  },

  //Finding the number of channels/user a user subscribedTo
  {
    $lookup:{
      //kis docs se karna hai 
      from:"subscriptions",
      localField:"_id",

      //We will look for the docs for which a channel has that user name as a subscriber 
      foreignField:"subscriber",
      as:"subscribedTo"
      
    }
  },
  //adding the data and putting in the final
  {
    $addFields :{
      subcriberCount :{
        $size :"$subscriber"
      },
      subscribedToCount :{
        $size :"$subscribedTo"
      },

      //kisi channel/user ke subscribers ki list me hai hu ki nai 
      isSubscribed:{
        $cond:{
          if:{$in:[req.user?._id,"$subscribers.subscriber"]},
          then:true,
          else:false
        }
      }
    }
  },

  //Project : Giving out the selected things 
  {
    $project :{
      fullName:1,
      username :1,
      subcriberCount:1,
      subscribedToCount:1,
      isSubscribed:1,
      avatar:1,
      coverImage:1,
      email:1
    }
  }
  
])

if(!channelInfo?.length){
  throw new ApiError(404,"Channel does not Exist")
}

return res
.status(200)
.json(new ApiResponse(200,channelInfo[0],"Channel Info Fethced Successfully "))

})



export {
  registerUser ,
  loginUser ,
  logoutUser ,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser ,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage ,
  getUserChannelProfile
};