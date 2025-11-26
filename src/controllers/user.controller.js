import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { fileUploadCloudinary } from "../utils/FileUploadOnCloud.js"
import {ApiResponse} from "../utils/ApiResponse.js"

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

export {registerUser}