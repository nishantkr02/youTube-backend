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









 ## using the PostMan for backEnd  :;:::>> Body Tag >>  select form-data >> add key value pairs 

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

 ## req.body ::::::::::::::::::::::::::::::The Sent Data by the User  : [Object: null prototype] {

  fullName: 'Nishant Kumar',
  email: 'nick3@gmail.com',
  username: 'Nishant',
  password: 'hitherewhy'
}

 ## response from the clodinary ::::::::::::>const coverImage= await uploadOnCloudinary(coverLocalPath) ;
   >console.log(coverImage);

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

## The response From Cloudinary Aster Uploading  :: >const avatar = await uploadOnCloudinary(avatarLocalPath) ;
 >console.log(avtar)
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



## Data stored in req.fiels  ::::> console.log("Data Stores in Req.files  :: ",req.files) ;

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


 >> New Controller :: refreshAccessToken
 use of tokens  : User ko baar baar login na karne pare .

 access token is short lived ., but the refresh Token is stored in the database .
 > session storage or refreshToken : so suppose our access session has expired and we got the 401 request ,then instead of asking user to login again, what we can do is , we can hit an endpoint and ask the user to refresh the access token .

 How Will they refresh and get the new token   ??
 In that request we will send the refresh token with it, then it will match the refresh token with the database , if it matches , we will provide a new  acessToken .



 >> New Controller :: refreshAccessToken , updateUserInfo , Update Cover Image and udpate Avatar 



 ## ----------------------------------------------------------------------------------------------------------------------------------------------- ##

 ## UnderStanding the Subscription Schema 
  > Problem : When we open the profile of a user/channel on youtube  we can see his subscriber and the channel he  has subscribed ,
  and the Subscribe Button name will be differebt for the users , who are subscribed and who aren't . So these are the things we have to keep in mind .
  > Why can't we added a subscriber feild in the userSchema itself , and store the subscriberes as am array ..?
  So we cannot simply add the values into an array , as the number of subscriber can be very high , then it will not be efficient, as we need to add or remove the subscriber from the list of users .

  >> So we need a separate storage and schema for it ., and later we will join these two tables to access the data .

=> Channel search se => Number of Subscriber for that channel  
=> Subsciber search se  => Number of channel , to which that user has subscribed .



## Response from cloudinary after video file uplo

>Video File Details  from cloudinary :
 {
  asset_id: '1be0586dc98f0d2309c0a227504b629a',
  public_id: 'xk6j64urca9kpiytre2y',
  version: 1714800725,
  version_id: '7783d7d379db7835c0d5aa63a89991f4',       
  signature: '069153578754010cfc48cfc0b39c52e74b0f382a',
  width: 1280,
  height: 720,
  format: 'mp4',
  resource_type: 'video',
  created_at: '2024-05-04T05:32:05Z',
  tags: [],
  pages: 0,
  bytes: 1754229,
  type: 'upload',
  etag: '136859765322813f052e3d1cdf346dd2',
  placeholder: false,
  url: 'http://res.cloudinary.com/yourtube-backend/video/upload/v1714800725/xk6j64urca9kpiytre2y.mp4',
  secure_url: 'https://res.cloudinary.com/yourtube-backend/video/upload/v1714800725/xk6j64urca9kpiytre2y.mp4',
  playback_url: 'https://res.cloudinary.com/yourtube-backend/video/upload/sp_auto/v1714800725/xk6j64urca9kpiytre2y.m3u8',
  folder: '',
  audio: {
    codec: 'aac',
    bit_rate: '173712',
    frequency: 48000,
    channels: 2,
    channel_layout: 'stereo'
  },
  video: {
    pix_format: 'yuvj420p',
    codec: 'h264',
    level: 31,
    profile: 'Main',
    bit_rate: '5380999',
    dar: '16:9',
    time_base: '1/30000'
  },
  is_audio: false,
  frame_rate: 14.833333333333334,
  bit_rate: 5540399,
  duration: 2.529367,
  rotation: 0,
  original_filename: 'WIN_20220410_15_27_10_Pro',
  nb_frames: 38,
  api_key: '379259554124669'
}





>>---------------------- ----------------------------------

## Some Notes : 

>> The findOne() method can be used with more than one condition

>> For any file upload , add multer middleware in the route
 
 >> While I was at Like Model : We have so many feilds there , but we don't have to populate all of them for every document .
 > Soooo, it's not necessary to provide all fields while creating a document in MongoDB. MongoDB is not a relational database, so fields in one document in a collection don't need to match the fields in other documents in the same collection, and fields don't need to be present at all.

 >> If we don include , verifyJWT middleware in the routes then the req.user wont get the details iof the user in it .

 >> #To use the $sort modifier, it must appear with the $each modifier. You can pass an empty array [] to the $each modifier such that only the $sort modifier has an effect.
{
  $push: {
     <field>: {
       $each: [ <value1>, <value2>, ... ],
       $sort: <sort specification>
     }
  }
}

For <sort specification>:

## To sort array elements that are not documents, or if the array elements are documents, to sort by the whole documents, specify 1 for ascending or -1 for descending.

If the array elements are documents, to sort by a field in the documents, specify a sort document with the field and the direction, i.e. { field: 1 } or { field: -1 }
> db.students.updateOne(
   { _id: 1 },
   {
     $push: {
       quizzes: {
         $each: [ { id: 3, score: 8 }, { id: 4, score: 7 }, { id: 5, score: 6 } ],
         $sort: { score: 1 }
       }
     }
   }
)

>> To remove one or many entries from an array
{
      _id: 1,
      fruits: [ "apples", "pears", "oranges", "grapes", "bananas" ],
      vegetables: [ "carrots", "celery", "squash", "carrots" ]
   }
   ,
   {
      _id: 2,
      fruits: [ "plums", "kiwis", "oranges", "bananas", "apples" ],
      vegetables: [ "broccoli", "zucchini", "carrots", "onions" ]
   }

   ## db.stores.updateMany(
    { },
    { $pull: { fruits: { $in: [ "apples", "oranges" ] }, vegetables: "carrots" } }
)