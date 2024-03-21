
//taking a function and returaning a function as well 
const asyncHandler = (requestHandler)=>{
  
   return (req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).
    catch((err)=>next(err))
  }
}


export {asyncHandler}


/*



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

