import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser =  asyncHandler(async (req,res)=>{
      res.status(200).json({
        message:"He there .. Testing this on PostMan"
    })
})

export {registerUser};