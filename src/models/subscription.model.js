import mongoose from "mongoose";

const subscriptionSchema= new mongoose.Schema({

    subscriber :{
        type :mongoose.Schema.Types.ObjectId,//the one who is subscribing
        ref :"User"
    },
    channel :{
        type :mongoose.Schema.Types.ObjectId,//the one to  whom the subscriber is subscribing
        ref :"User"
    },

},{timestaps:true})

export const Subscription= mongoose.model("Subscription",subscriptionSchema)