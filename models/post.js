import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    newpost: {
        type: String,
        required: true,
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
        type: ObjectId,
        trim: true,
        ref: "comment"
    },],
    user: {
        type: ObjectId,
        ref: "user"
    }

});

const Post = mongoose.model("post", postSchema);

const commentSchema = new mongoose.Schema({
    text: {
        type: String
    },
    author: {
        type: ObjectId,
        ref: "user"
    }
})

const Comment = mongoose.model("comment", commentSchema)

export { Post, Comment };