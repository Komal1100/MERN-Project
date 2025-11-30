import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { fileUploadCloudinary } from "../utils/FileUploadOnCloud.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const registerUser = asyncHandler(
    async (req , res) => {

        // Ger user detail from user
        const {userName , fullName , email , password } = req.body

        // Validation 
        
        // 1. All fields are required
        if(
            [userName , fullName , email  , password].some((field)=>
              field?.trim() === "")
        ){
            throw new ApiError(400 , `${field} is required`);
        }

        // 2. User already exist 
        const existedUser = await User.findOne(
            {
                $or : [{userName} , {email}]
            }
        )

        if(existedUser) {
            throw new ApiError(409 , "User with email or userName already exists")
        }

        // 3. Check for images
        // console.log(req.files);
        
        const avtarLocalPath = req.files?.avatar[0]?.path
        const coverImageLocalPath = req.files?.coverImage[0]?.path

        if(!avtarLocalPath){
            throw new ApiError(400 , "Avatar image is required")
        }

        // Upload Files on Cloudinary
        const avatar = await fileUploadCloudinary(avtarLocalPath)
        const coverImage = await fileUploadCloudinary(coverImageLocalPath)

        if(!avatar){
            throw new ApiError(500, "There is error in upload avatar file")
        }

        const user = await User.create({
            fullName , 
            avatar : avatar.url,
            coverImage : coverImage?.url || "",
            userName : userName.toLowerCase(),
            email,
            password
        })

        // Check for user created or not in database & delete password and refreshToken field

        const createdUser = await User.findById(user._id).select("-password -refreshToken")
        if(!createdUser){
            throw new ApiError(500 , "There is something wrong while user create in database")
        }

        // Return response

        return res.status(201).json(
            new ApiResponse(200 , createdUser , "User Registered Succesfully")
        )

    }
)

const generateAccessRefreshToken = async (user_id)=>{
    try {
        const user = await User.findById(user_id)

        const refreshToken =  await user.generateRefreshToken()
        const accessToken = await user.generateAccessToken()
       
        user.refreshToken = refreshToken
        await user.save({validBeforeSave : false})
        return {accessToken , refreshToken}
    } catch (error) {
        throw new ApiError(500 , "There is error in generate refresh and access token")
    }
}

const login = asyncHandler(
    async(req , res) =>{
        // get username or email and password from user
        // validation
        // check user exists or not 
        // if user exists check password iss correct or not 
        // generate jwt tokens
        // send cookie

        const {email ,  userName , password} = req.body

        if(!userName && !email){
            throw new ApiError(400 , "Username and password is required")
        }

        const user = await User.findOne({
            $or : [{userName} , {email}]
        })

        if(!user){
            throw new ApiError(404," Invalid user credentials")
        }

        const isPasswordValid = await user.isPasswordCorrect(password)

        if(!isPasswordValid){
            throw new ApiError(400 , "Password is incorrect")
        }

        const {refreshToken , accessToken} = await generateAccessRefreshToken(user._id)
         
        const loginUser = await User.findById(user._id)
        // For Cookie

        const option = {
            httpOnly : true ,
            secure : true
        }

        return res.
               status(200)
               .cookie("accessToken" , accessToken , option)
               .cookie("refreshToken" , refreshToken , option)
               .json(
                    new ApiResponse(
                        200,
                        { user: loginUser, accessToken, refreshToken },
                        "User Login Successfully"
                    )
                 );
    }
)

const logout = asyncHandler(
    async(req ,res)=>{
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set :{
                    refreshToken : undefined
                }
            },
            {
                new : 1
            }
        )

        const option = {
            httpOnly : true,
            secure : true
        }

        return res
               .status(200)
               .clearCookie("accessToken",option)
               .clearCookie("refreshToken", option)
               .json(new ApiResponse(200 , "User Logout"))
    }
)

const refreshAccessToken = asyncHandler (
    async (req , res)=>{
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

        if(!incomingRefreshToken){
            throw new ApiError(400 , "unauthorized access")
        }

        try {
            const decoedInToken =  jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)

            const user = await User.findById(
                decoedInToken._id
            )

            if(!user){
                throw new ApiError(404 , "Invalid refresh token")
            }

            if(incomingRefreshToken!=user.refreshToken){
                throw new ApiError(401 , "Refresh Token i sexpired or use")
            }

            const option = {
                httpOnly : true,
                secure : true
            }

            const {accessToken , refreshToken} = await generateAccessRefreshToken(user._id)

            return res
                   .cookie("accessToken" , accessToken ,option)
                   .cookie("refreshToken" , refreshToken , option)
                   .json(new ApiResponse(200 , {refreshToken : refreshToken}),"Access Token Refresh" )

        } catch (error) {
            throw new ApiError(400 ,  error.message + "Invalid refreshToken")
        }
    }
)
export {registerUser,
        login,
        logout,
        refreshAccessToken
}