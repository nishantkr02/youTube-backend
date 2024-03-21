import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"          

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
       api_key: process.env.CLOUDINARY_API_KEY ,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
   const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) return null ;
        
        //uploading on cloudinary 
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })

        //Now the file has been uploaded 
        console.log('File is uploaded on Cloudinary ',response.url) ;
        //returning the whole response on uploading 
        return response ;

    }catch(error){
        ///if the file is malecious 
        fs.unlinkSync(localFilePath) //Removes the locally saved temporary file as the opeartion got failed ;

        return null ;

    }
   }
    export {uploadOnCloudinary}
