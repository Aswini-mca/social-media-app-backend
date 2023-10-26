import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    newpost: {
        type: String,
        trim: true
    },
    likecount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    },
    comments: [{
        comment: String,
        author: ObjectId
    }],
    user: {
        type: ObjectId,
        ref: "user"
    }

});

const Post = mongoose.model("post", postSchema);

export { Post };