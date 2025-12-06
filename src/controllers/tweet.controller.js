import { Tweet } from "../models/tweet.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { fileUploadCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"

const createTweet = asyncHandler(
    async (req, res) => {

        const user = req.user

        if (!user) {
            throw new ApiError(404, "User not found, please login first")
        }

        const { content } = req.body

        if (!req.files?.path && !content) {
            throw new ApiError(401, "Please provide content or image")
        }

        const imageLocal = req.files ? req.files?.map(file => file.path) : []



        const image = imageLocal.length
            ? await Promise.all(imageLocal.map(fileUploadCloudinary))
            : [];

        const tweet = await Tweet.create(
            {
                owner: user._id,
                content: {
                    image,
                    text
                }
            }
        );

        return res
            .status(200)
            .json(
                new ApiResponse(200, tweet, "Tweet successsfully")
            )

    }
)

const getUserTweet =  asyncHandler(
    async (req,res) => {
        const {userName} = req.params

        if(!userName){
            throw new ApiError(401 , "userName not found")
        }

        const user = await User.findOne(
            {
                userName : userName.trim()
            }
        )

        if(!user){
            throw new ApiError(404 , "Can not find user")
        }

        const tweets = await Tweet.find(
            {owner : user._id }
        ).sort({createdAt : -1})

        return res
               .status(200)
               .json(
                new ApiResponse(200 , tweets , "Tweets fetched successfully")
               )
    }
)

const updateTweet = asyncHandler(
    async (req,res)=>{
        const {id} = req.params
        const {content , deleteImage} = req.body
        const newImages = req.files

        if(!content && deleteImage?.length==0){
            throw new ApiError(401 , "Please provide content to update")
        }

        const tweet = await Tweet.findById(
            {_id : id}
        )

        if(!tweet){
            throw new ApiError(404 , "Can not find tweet")
        }

        if(tweet.owner.toString() != req.user._id.toString()){
            throw new ApiError(403 , "You are not authorized to update this tweet")
        }

        if(content){
            tweet.content.text = content
        }


        if(deleteImage?.length>0){
            tweet.content.image = tweet.content.image.filter(url => !deleteImage.includes(url))

            await Promise.all(
                deleteImage.map(url => fileDeleteCloudinary(url))
            )
        }

        if(newImages?.length>0){
            await Promise.all(
                newImages.map(file => tweet.content.image.push(fileUploadCloudinary(file.path))?.url)
            )
        }

        const updateTweet = await tweet.save()

        return res
               .status(200)
               .json(
                new ApiResponse(200 , updateTweet , "Update tweet succesfully")
               )

    }
)

const deleteTweet = asyncHandler(
    async (req,res) =>{
        const {id} = req.params

        if(!id){
            throw new ApiError(401 , "Give id ")
        }

        const tweet = await Tweet.findById({id})

        if(!tweet){
            throw new ApiError(404 , "Tweet not found")
        }

        if (tweet.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are not authorized to delete this tweet");
        }

         if (tweet.content.image && tweet.content.image.length > 0) {
            await Promise.all(
                tweet.content.image.map(async (url) => {
                    try {
                        await fileDeleteCloudinary(url)
                    } catch (err) {
                        console.error(`Failed to delete image: ${url}`, err)
                    }
                })
            );
        }

        await tweet.deleteOne();

        return res.status(200).json(
            new ApiResponse(200, null, "Tweet deleted successfully")
        );
    }
)

export {
    createTweet,
    getUserTweet,
    updateTweet,
    deleteTweet
}