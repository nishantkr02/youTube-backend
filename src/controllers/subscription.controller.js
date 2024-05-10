import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiErrorHandler.js"
import {ApiResponse} from "../utils/ApiResponseHandler.js"
import {asyncHandler} from "../utils/asyncHandler.js"

// For the sake to uniformity  in the routes, I've used channelId as a params for both channel and user , as both are users underneath

const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
 const userId=req.user?._id ;

    if(!channelId || !userId)
        throw new ApiError(400,"Either Channel Id or User Id is not Valid or not Provided ..!! ");

    if(channelId.toString() === userId.toString())
        return res.status(400).json(new ApiResponse(400,{}," You don't subscribe to your Own Channel ..!!"))

const subscriber = await Subscription.findOne({subscriber:userId,channel:channelId})
console.log("Current user Id ",userId)

//let message ;

  if(!subscriber){

     const newSubscriber = await Subscription.create({
        subscriber:userId,
        channel:channelId
    })
    console.log("Subscriber Details : ",newSubscriber)
    if(!newSubscriber)
        throw new ApiError(400,"Unbale to toggle Subscription , try again later ..!!")
    
    //message = "SuccessFully Subscribered to the Channel ..!!"
    return res.status(200).json(new ApiResponse(201,newSubscriber,"SuccessFully Subscribered to the Channel ..!!"))
    
}

    else{
        //how to remove subscriber ... ??
        const removeSubscription = await Subscription.findOneAndDelete({subscriber:userId,channel:channelId})

        if(!removeSubscription)
            throw new ApiError(400,"Unable to Subcribe , try again ..!!")

        //message = "SuccessFully UnSubscribered to the Channel ..!! "
        return res.status(200).json(new ApiResponse(201,removeSubscription,"SuccessFully UnSubscribered to the Channel ..!!"))
    
        
    }

  
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId )
        throw new ApiError(400,"Either Channel Id is not Valid or not provided..!!");


    const subscriberList = await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel" ,
                as:"subscribers" ,
                
                pipeline:[
                    {
                        // This is just for the better visiblity , remove this if required
                        $project:{
                            channel:0,
                           
                        }
                    },

                    {
                        $lookup:{
                            from:"users",
                            localField:"subscriber",
                            foreignField:"_id",
                            as:"Subscriber_Details",

                            pipeline:[
                                {
                                    $project:{
                                        fullName:1 ,
                                        _id:0 ,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    
                ]


            }
        },
        {
            $addFields:{
                totalSubcriber :{
                    $size:"$subscribers"
                }
            }
        },
        {
            $project:{
            
                fullName:1,
                avatar:1 ,
                totalSubcriber:1,
                subscribers:1,
                
            }
        }
      ])

      if(!subscriberList?.length)
      throw new ApiError(400,"No Subscribers Found or Unable to fetch Subscribers ")

      return res.status(201).json(new ApiResponse(200,subscriberList,"Subscriber List fetched Successfully"))
    

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    //chhanel is also a user hi na 
    const { channelId } = req.params
    if(!channelId )
        throw new ApiError(400,"Either Channel Id is not Valid or not provided..!!");
    const subscribedToList = await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber" ,
                as:"subscribedTo" ,
                pipeline:[
                    
                    {
                        // This is just for the better visiblity , remove this if required
                        $project:{
                            subscriber:0,
                           
                        }
                    },
                    {
                        $lookup:{
                            from:"users",
                            localField:"channel",
                            foreignField:"_id",
                            as:"Channel_Details",

                            pipeline:[
                                {
                                    $project:{
                                        fullName:1 ,
                                        _id:0 ,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    
                ]
            }
        },
        {
            $addFields:{
                totalSubcribedChannel :{
                    $size:"$subscribedTo"
                }
            }
        },
        {
            $project:{
                fullName:1,
                avatar:1 ,
                subscribedTo:1 ,
                totalSubcribedChannel:1,
            }
        }
      ])

      if(!subscribedToList?.length)
      throw new ApiError(400,"No Subscribed Channels Found or Unable to fetch Subscribed Channels List ")

      return res.status(201).json(new ApiResponse(200,subscribedToList," Subscribed Channel List fetched Successfully"))
    
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}