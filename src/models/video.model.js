import mongoose from "mongoose"
import  mongooseAggregatePaginate from  "mongoose-aggregate-paginate-v2"






const videoSchema = new mongoose.Schema({
    videoFile:{
        type:String , //cloudinary url 
        required:true ,
    },
    thumbnail:{
        type:String , //cloudinary url 
        required:true ,
    },
    title:{
        type:String , 
        required:true ,
    },
    description:{
        type:String , 
        required:true ,
    },
    duration:{
        type :Number,  //details from cloudinary url 
        required :true
    },
    views:{
        type :Number, 
        default:0 ,
       
    },
    isPublished :{
        type:Boolean ,
        default :true 
    },
    owner :{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }





},{timestamps:true})

//adding this as a plugins 
videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video",videoSchema) ;