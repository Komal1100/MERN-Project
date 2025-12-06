import mongoose, {Schema} from "mongoose";

const playlistSchema = new Schema (
    {
        videos : [
            {
                type : Schema.Types.ObjectId,
                ref : "Video"
            }
        ],
        name : {
            type : String,
            required  : true
        },
        description : {
            type : String
        },
        owner : {
            type :  Schema.Types.ObjectId,
            ref : "User",
            required : true
        }
    },
    {
        timestamps : true
    }
)

export const PlayList = new mongoose.model("PlayList" , playlistSchema)