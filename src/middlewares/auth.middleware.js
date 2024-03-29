import { ApiError } from "../utils/ApiErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
// This is the basis on which we will verify the  user 
export const  verifyJWT = asyncHandler(async (req,res,next)=>{

  try {
     // cookies has the access of the tokens , since we added them while logging in the user 
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","") 
       
     if(!token){
      throw new ApiError(401,"Unauthorized Request");
     }
     
     //jwt.verify gives decoded tokens 
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
    const user  = await User.findById(decodedToken?._id).select("-password -refreshToken")
  
    if(!user){
      throw new ApiError(401,"Invalid Access Token") ;
    }
  
    req.user= user ;

    // This is the feild that tells to move on to the next middlware function or to the 
    next() ;


  } catch (error) {
    throw new ApiError(401,error?.message || "Invalid access Token ")
    
  }





})