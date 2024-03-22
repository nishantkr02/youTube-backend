import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"





const userSchema = new mongoose.Schema({
    username :{
        type:String ,
        required :true,
        unique :true ,
        lowercase:true ,
        trim:true,
        index:true 
    },
    email:{
        type:String ,
        required :true,
        unique :true ,
        lowercase:true ,
        trim:true 
    },
    fullName :{
        type:String ,
        required :true,
        trim:true,
        index:true 
    },
    avtar:{
        type :String , //cloudinary url 
        required :true ,
    },
    coverImage :{
        type:String ,
    },
    //this will have the array of watched video 
    watchHistory :[
        {
            type :mongoose.Schema.Types.ObjectId,
            ref :"Video"
        }
    ],
    password:{
        type:String,
        required :[true ,'Passwrod is required'] ,
    },
    refreshToken:{
        type:String ,
    },

},{timestamps:true})

//Encrpting the password before saving 
 userSchema.pre("save",async function(next){

    if(! this.isModified("password")) return next() ;

    this.password = await bcrypt.hash(this.password , 10 )
    next() ;
 })


// method  checking if the password entered is true or not .
userSchema.methods.isPasswordCorrect = async function(password){
       // return await bcrypt.compare(providedData , encryptedData) //true/false
       return await  bcrypt.compare(password, this.password) 
}

//method to generate access token :: jwt.sign(payload, secretOrPrivateKey, [options, callback])
    userSchema.methods.generateAccessToken = function(){
        jwt.sign({
            _id:this._id,
            email:this.email ,
            username :this.username,
            fullName : this.fullName
             } ,
             process.env.ACCESS_TOKEN_SECRET ,
             {
                expiresIn : process.env.ACCESS_TOKEN_EXPIRY ,
             }

        )
    }

//method to generate refresh token
userSchema.methods.generateRefreshToken = function(){
    jwt.sign({
        _id:this._id,
       
         } ,
         process.env.REFRESH_TOKEN_SECRET  ,
         {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY ,
         }

    )
}



export const User = mongoose.model("User",userSchema) ;