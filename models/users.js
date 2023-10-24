import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
        username: {
            type: String,
            maxlength: 20,
            trim: true,
            unique: true
        },
        firstname: {
            type: String,
            trim: true,
        },
        lastname: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            trim: true
        },
        gender: {
            type: String,
            trim: true
        },
        dob: {
            type: String,
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