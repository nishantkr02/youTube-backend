

const asyncHandler = (requestHandler)=>{
  (req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).
    catch((err)=>next(err))
  }
}


export {asyncHandler}


/* imagine this , here we are passing a function to the function itself 
 const asyncHandler = async ()=>{}
 const asyncHandler =(fn) =>{async ()=>{}} 



  /// THis is also a method 
 const asyncHandler=(fn) =>async (req,res,next)=>{
    try{
      await fn(req,res,next)
    }catch(err){
      res.status(err.code || 500) .json({
        sucess:false,
        message :err.message 
    })
    }

 }
 */

