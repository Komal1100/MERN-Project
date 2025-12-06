import { Like } from "../models/like.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const toggleVideoLike = asyncHandler(
    async (req,res) => {
        const {videoId} = req.params
        const user = req.user

        if(!videoId){
            throw new ApiError(400 , "video not found")
        }

        if(!user){
            throw new ApiError(401 , "First login to toggle like")
        }

        const existedLike = await Like.findOne(
            {video : videoId, likedBy :user._id}
        )

        if(!existedLike){
            const like =await Like.create(
                {
                    video : videoId,
                    likedBy : user._id
                }
            )
        }else{
            await existedLike.deleteOne()
        }

        return res
               .status(200)
               .json(
                 new ApiResponse(200 , {like : !existedLike} , "toggel successfully")
               )
    }
)

const toggleCommentLike = asyncHandler(
    async (req,res) => {
        const {commentId} = req.params
        const user = req.user

        if(!commentId){
            throw new ApiError(400 , "comment not found")
        }

        if(!user){
            throw new ApiError(401 , "First login to toggle like")
        }

        const existedLike = await Like.findOne(
            {comment : commentId, likedBy :user._id}
        )

        if(!existedLike){
            const like =await Like.create(
                {
                    Comment : commentId,
                    likedBy : user._id
                }
            )
        }else{
            await existedLike.deleteOne()
        }

        return res
               .status(200)
               .json(
                 new ApiResponse(200 , {like : !existedLike} , "toggel successfully")
               )
    }
)

const toggleTweetLike = asyncHandler(
    async (req,res) => {
        const {tweetId} = req.params
        const user = req.user

        if(!tweetId){
            throw new ApiError(400 , "video not found")
        }

        if(!user){
            throw new ApiError(401 , "First login to toggle like")
        }

        const existedLike = await Like.findOne(
            {tweet : tweetId, likedBy :user._id}
        )

        if(!existedLike){
            const like =await Like.create(
                {
                    tweet : tweetId,
                    likedBy : user._id
                }
            )
        }else{
            await existedLike.deleteOne()
        }

        return res
               .status(200)
               .json(
                 new ApiResponse(200 , {like : !existedLike} , "toggel successfully")
               )
    }
)

const getLikedVideos = asyncHandler (
    async (req ,res) => {
        const video = await Like.find(
            {
             likedBy : req.user._id , 
             video : {$ne : null}
            } ,
            {video : 1 , _id : 0}
            .populate("video")

        )

        return res
               .status(200)
               .json(
                new ApiResponse(200 , video , "Liked video fetched")
               )
    }
)