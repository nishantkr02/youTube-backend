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

->>input data ko process karenge  : get User detials form the frontend 

->> Thora validation karenge , ki thik se desired data diya hai ki nai :E.g ::
empty and all , user already exist or not : By using  email and username , files send hua hai ki nai , like files and all . 
->  Store karenge us data ko cloudinary pe ,check karenge data thik se aaya hai ki nai  avtar and all .
-->> Create user Object : Create entry in the DB .
-->> Remove passeord and refresh token feild from response  while sending .
-->> check from creation , user bana ki nai 
-->> return res


## The user Model which we created earlier , can be used to talk to the database directly . It will call the database to check diferenct things and many other task 









 ## using the PostMan for backEnd  :;:::
  >> Body Tag >>  select form-data >> add key value pairs 

  >> Posatman  response : ::::::::::::::::
  {
    "statusCode": 200,
    "data": {
        "_id": "65fe52f09b292c9c3a710d05",
        "username": "nikku khan",
        "email": "nick@gmail.com",
        "fullName": "Nishant Kumar",
        "avatar": "http://res.cloudinary.com/yourtube-backend/image/upload/v1711166189/c1i7strjqr8clidjiotw.jpg",
        "coverImage": "http://res.cloudinary.com/yourtube-backend/image/upload/v1711166192/crc4eu8m969mtvuemodx.png",
        "watchHistory": [],
        "createdAt": "2024-03-23T03:56:32.966Z",
        "updatedAt": "2024-03-23T03:56:32.966Z",
        "__v": 0
    },
    "message": "User Registered SucessFully !!",
    "success": 200
}

{
    "statusCode": 200,
    "data": {
        "_id": "65fe55bf1e77e7c740f87f1e",
        "username": "sher  khan",
        "fullName": "Nishant Kumar",
        "avatar": "http://res.cloudinary.com/yourtube-backend/image/upload/v1711166908/oklvewxmbusvd52joavw.jpg",
        "coverImage": "http://res.cloudinary.com/yourtube-backend/image/upload/v1711166911/e1he3ksxw4273gmyzalj.png",
        "watchHistory": [],
        "createdAt": "2024-03-23T04:08:31.579Z",
        "updatedAt": "2024-03-23T04:08:31.579Z",
        "__v": 0
    },
    "message": "User Registered SucessFully !!",
    "success": 200
}





>> On mongo Db ::::::::::::::::::
{"_id":{"$oid":"65fe52f09b292c9c3a710d05"},"username":"nikku khan","email":"nick@gmail.com","fullName":"Nishant Kumar","avatar":"http://res.cloudinary.com/yourtube-backend/image/upload/v1711166189/c1i7strjqr8clidjiotw.jpg","coverImage":"http://res.cloudinary.com/yourtube-backend/image/upload/v1711166192/crc4eu8m969mtvuemodx.png","watchHistory":[],"password":"$2b$10$yiC8D.AMFNL1xgb0EvC08eW/pwC2EdqHmGvO5Hq7muYo8uKpC8MMq","createdAt":{"$date":{"$numberLong":"1711166192966"}},"updatedAt":{"$date":{"$numberLong":"1711166192966"}},"__v":{"$numberInt":"0"}}



>> Now let's see the , req.body ,req.files and response from the cloudinary  after uplaoding the files  :::

 ## req.body ::::::::::::::::::::::::::::::
 The Sent Data by the User  : [Object: null prototype] {
  fullName: 'Nishant Kumar',
  email: 'nick3@gmail.com',
  username: 'Nishant',
  password: 'hitherewhy'
}
 ## response from the clodinary ::::::::::::

 The response From Cloudinary Aster Uploading  ::
  {
  asset_id: '5372e4c86d6551da310b2e6bba5e7c1d',
  public_id: 'x7xhtehroefufbakzgpw',
  version: 1711167681,
  version_id: '38c5f5b9aebd8d4870d32f152ab39827',
  signature: 'db6032a3b223b84c80abff85fe42823126ab592a',
  width: 1000,
  height: 1000,
  format: 'jpg',
  resource_type: 'image',
  created_at: '2024-03-23T04:21:21Z',
  tags: [],
  bytes: 200680,
  type: 'upload',
  etag: 'b9997488508854789be44d1b072361bf',
  placeholder: false,
  url: 'http://res.cloudinary.com/yourtube-backend/image/upload/v1711167681/x7xhtehroefufbakzgpw.jpg',
  secure_url: 'https://res.cloudinary.com/yourtube-backend/image/upload/v1711167681/x7xhtehroefufbakzgpw.jpg',
  folder: '',
  original_filename: 'harkirat',
  api_key: '379259554124669'
}
The response From Cloudinary Aster Uploading  :: 
{
  asset_id: 'dea7484265809f75ead28b6a484e6edd',
  public_id: 'd3qkwlcmvd0c6n6cnule',
  version: 1711167684,
  version_id: '5267833c9983148f3aaa7e55bfcae6e5',
  signature: 'ca0bfe17f488f0f52765593dd3fcd8f4e1779d79',
  width: 512,
  height: 512,
  format: 'png',
  resource_type: 'image',
  created_at: '2024-03-23T04:21:24Z',
  tags: [],
  bytes: 48993,
  type: 'upload',
  etag: '4f03e0e0b2e7ba1a4da0330ebb59536d',
  placeholder: false,
  url: 'http://res.cloudinary.com/yourtube-backend/image/upload/v1711167684/d3qkwlcmvd0c6n6cnule.png',
  secure_url: 'https://res.cloudinary.com/yourtube-backend/image/upload/v1711167684/d3qkwlcmvd0c6n6cnule.png',
  folder: '',
  original_filename: 'bmi',
  api_key: '379259554124669'
}



## Data stored in req.fiels  ::::
Data Stores in Req.files  ::  [Object: null prototype] {
  avatar: [
    {
      fieldname: 'avatar',
      originalname: 'harkirat.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      destination: './public/temp',
      filename: 'harkirat.jpg',
      path: 'public\\temp\\harkirat.jpg',
      size: 200680
    }
  ],
  coverImage: [
    {
      fieldname: 'coverImage',
      originalname: 'bmi.png',
      encoding: '7bit',
      mimetype: 'image/png',
      destination: './public/temp',
      filename: 'bmi.png',
      path: 'public\\temp\\bmi.png',
      size: 48993
    }
  ]
}




## Why do we need 2 Tokens  ::Access and Refresh Token :: >>> 
Access Token :Short Lived 
> We will able to use the all features till we have the access token  .

 Refresh Token  : Long Lived 
> When to provide new access token to the user , it helps us to manage the access token  .
In real life , A refresh token just helps you re-validate a user without them having to re-enter their login credentials multiple times


>> New Controller  :: loginUser >>
 Logic :
 -> Get the data from the req.body ()
 -> Data verification : if the username or email is provided 
 -> Find the user 
 -> Verify password
 -> Generate Tokens  : Acess and Refresh Token 
 -> Send them back as Cookies 
 -> Resoponse 


## User and user ka difference  ???
> User => 
   MongoDb ka Mongoose ka ek object hai ,Mongoose ka methods iske through acess karna hai 
 > user => 
 ye intance hai database wale User ka , jo humne waps liya hai waha se .Aur mere banaye hue sare methods and fucntion humne apne user pe banay hai , joki instance hai hamara uss database wale  User ka  .

 >> New Controller  :: LogOut >>
  How  ?? :: clear cookie , and clear out the tokens .

 > cookie is a two way feild , both request and response also has the access 