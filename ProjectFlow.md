## After setting up the basic Project

>> Step 1 > Create Public and Temp  Folder 
>Create src folder  > create files app.js constants.js index.js

> setup the package.json
>setUp nodemon

## Create the folders  : 
controllers
db
middlewares
models
routes
utils  


## Controller Logic building ::
>> registeUser ::: 

>input data ko process karenge  : get User detials form the frontend 

>> Thora validation karenge , ki thik se desired data diya hai ki nai :E.g ::
empty and all , user already exist or not : By using  email and username , files send hua hai ki nai , like files and all . 
>  Store karenge us data ko cloudinary pe ,check karenge data thik se aaya hai ki nai  avtar and all .
>> Create user Object : Create entry in the DB .
>> Remove passeord and refresh token feild from response  while sending .
>> check from creation , user bana ki nai 
>> return res


## The user Modedel which we created earlier , can be used to talk to the database directlt . It will call the database to check diferenct thgings and many other task 