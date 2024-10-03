import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler (async (req, res) => {
    // get user details from frontend 
    // validatioin - not empty
    // check if user already exists : username, email
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response 

    const {fullName, email, username, password } = req.body
    // console.log("email: ", email);

    if (fullName === ""){
        throw new ApiError(400, "fullname is required")
    }
    if (email === ""){
        throw new ApiError(400, "email is required")
    }
    if (username === ""){
        throw new ApiError(400, "username is required")
    }
    if (password === ""){
        throw new ApiError(400, "password is required")
    }

    const exitedUser = User.findOne({
        $or: [{ username },{ email }]
    })
    if(exitedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is reqired")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar){
        throw new ApiError(400, "Avatar file is reqired")
    }
    
   const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "", //since the coverImage is not mandatory so it is possible that no url is generated so we have to check ? and then proceed 
        email,
        password,
        username: username.toLowerCase()

    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

export {registerUser}