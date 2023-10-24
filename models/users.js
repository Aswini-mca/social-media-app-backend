import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
            maxlength: 20,
            trim: true,
            unique: true
        },
        firstname: {
            type: String,
            required: true,
            trim: true,
        },
        lastname: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true
        },
        gender: {
            type: String,
            required: true,
            trim: true
        },
        dob: {
            type: String,
            required: true,
            trim: true
        },
        resetToken:{
            type:String
        },
        resetTokenExpiresAt:{
            type:Date
        }
    });

    const User = mongoose.model("user",userSchema);
    export {User};