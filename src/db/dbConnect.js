import mongoose from "mongoose"
import {DB_NAME} from "../constants.js"
 
const dbConnect = async ()=>{
    try{
        const connetionInstance =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       // console,log(connetionInstance) => HW 
        console.log(`\n Yayy ..!! MongoDb Connected ::: DB Host ::> ${connetionInstance.connection.host}`) ;

    }catch(err){
        console.log("MongoDb Error Occured , Connection Failed :",err)
        //insted of using throw err , we will use process.exit(1)
        process.exit(1)
    }
}

export default dbConnect ;