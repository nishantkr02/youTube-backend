import mongoose from "mongoose"
import  mongooseAggregatePaginate from  "mongoose-aggregate-paginate-v2"
const commentSchema = new mongoose.Schema({

    content :{
        type:String ,
        required :true,
    },
    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref :"Video"
    } ,
    owner :{
        type:mongoose.Schema.Types.ObjectId,
        ref :"User"
    }


},{timestamps:true})


//adding this as a plugins  : This insure how many items to show on a single page
commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.mode("Comment",commentSchema);