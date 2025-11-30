import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const verifyUser = asyncHandler(
    
    async (req , res , next)=>{
        try {
            const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

            if(!accessToken){
                throw new ApiError(401 , "unauthorized request")
            }

            const decoedToken = jwt.verify(accessToken , process.env.ACCESS_TOKEN_SECRET)

            const user = await User.findById(decoedToken?._id ).select("-password -refreshToken")

            if(!user){
                throw new ApiError(401 , "Invalid Token")
            }

            req.user = user
            next()
        } catch (error) {
            throw new ApiError(404 , error.message || "Invalid access token")
        }
    }
    
        
    
)

export { verifyUser}