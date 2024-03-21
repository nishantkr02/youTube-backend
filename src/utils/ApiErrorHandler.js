class ApiError extends Error{
    
    constructor (statusCode ,message ="Something Went Wrong", errors=[],stack ="" )
    {
        //The super keyword in JavaScript is used to call the constructor of a parent class, to access the parent's methods, and to override the parent's methods. It is used in classes to call the parent class's constructor or methods. It is used to access and call methods on an object's parent

        super(message)
        //this.varName =value
        this.statusCode=statusCode
        this.data = null 
        this.message= message 
        this.success = false 
        this.errors = errors

        if(stack){
            this.stack = stack 
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}
export {ApiError}