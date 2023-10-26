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
    user: {
        type: ObjectId,
        ref: "user"
    }

});

const Post = mongoose.model("post", postSchema);

const commentSchema = new mongoose.Schema({
    comment: {
        type: String
    },
    username: {
        type: String
    },
    userId: {
        type: ObjectId,
        ref: "user"
    },
    postId: {
        type: ObjectId,
        ref: "post"
    }
})

const Comment = mongoose.model("comment", commentSchema)

export { Post, Comment };