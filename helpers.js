import bcrypt from "bcrypt"
import randomstring from "randomstring"
import { User } from "./models/users.js"
import { Comment, Post } from "./models/post.js"

async function genPassword(password) {
    const salt = await bcrypt.genSalt(15) // bcrypt.genSalt(no. of rounds)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

function getUserByName(req) {
    return User.findOne({ username: req.body.username })
}

function getUserByEmail(req) {
    return User.findOne({ email: req.body.email })
}

function genToken() {
    const resetToken = randomstring.generate(20);
    return resetToken
}

async function storeResetToken(resetToken, userFromDB, resetTokenExpiresAt) {
    return await User.findOneAndUpdate({ _id: userFromDB._id }, { resetToken: resetToken, resetTokenExpiresAt: resetTokenExpiresAt })
}

async function getUserByResetToken(token) {
    return User.findOne({ resetToken: token })
}

async function updateNewPassword(resetToken, hashedPassword) {
    return await User.findOneAndUpdate({ _id: resetToken._id }, { password: hashedPassword, resetToken: null, resetTokenExpiresAt: null })
}

async function getUserById(userId) {
    return await User.findById(userId).select("_id username")
}

async function getAllPost() {
    return await Post.find().populate("user", "username")
}

async function getUserPost(req) {
    return await Post.find({ user: req.user._id }).populate("user", "username")
}

async function getPostById(req) {
    return await Post.findById({ _id: req.params.id })
}

async function newPost(req) {
    return new Post({
        ...req.body,
        user: req.user._id
    }).save();
}

async function updatePost(req) {
    return Post.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true }
    )
}

async function deletePost(req) {
    return Post.findByIdAndDelete({ _id: req.params.id })
}

async function createComment(req) {
    return new Comment({
        ...req.body,
        userId: req.user._id,
        postId: req.params.id
    }).save();
}

async function updateCommentCount(req) {
    return Post.updateOne(
        { _id: req.params.id },
        { $inc: { commentCount: 1 } }
    )
}

async function updateLike(req) {
    return Post.updateOne(
        { _id: req.params.id },
        { $inc: { likecount: 1 } }
    )
}
async function getComments(req) {
    return await Comment.find({ postId: req.params.id })
}

export { genPassword, getUserByName, getUserByEmail, genToken, storeResetToken, getUserByResetToken, updateNewPassword, getUserById, getAllPost, getUserPost,getPostById, newPost, updatePost, deletePost, createComment, updateCommentCount, updateLike, getComments }