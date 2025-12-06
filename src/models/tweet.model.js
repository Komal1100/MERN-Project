import mongoose , {Schema} from "mongoose";

const tweetSchema = new Schema(
    {
        owner : {
            type : Schema.Types.ObjectId,
            ref : "User"
        },
        content : {
            image : [
                {
                    type : String
                }
            ],
            text : {
                type : String,
            }
        }
    },
    {
        timestamps : true
    }
)

export const Tweet = new mongoose.model("Tweet" , tweetSchema)