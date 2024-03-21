import multer from "multer"



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //adress of the local storage 
      cb(null, "./public/temp")
    },
    
    filename: function (req, file, cb) {
     
        //this is just for now ,so we are not bothering now 
      cb(null, file.originalname )
    }
  })
  
  export const upload = multer({ storage: storage })
  