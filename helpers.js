import { client } from "./index.js";
import bcrypt from "bcrypt"
import randomstring from "randomstring"

async function genPassword(password) {
    const salt = await bcrypt.genSalt(15) // bcrypt.genSalt(no. of rounds)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

async function createUser(username, firstname, lastname, email, hashedPassword, gender, dob) {
    return await client.db("SMA").collection("users").insertOne({ username, firstname, lastname, email, password: hashedPassword, gender, dob })
}

async function getUserByName(username) {
    return await client.db("SMA").collection("users").findOne({ username: username })
}

async function getUserByEmail(email) {
    return await client.db("SMA").collection("users").findOne({ email: email })
}

function genToken() {
    const resetToken = randomstring.generate(20);
    return resetToken
}

async function storeResetToken(resetToken, userFromDB, resetTokenExpiresAt) {
    return await client.db("SMA").collection("users").updateOne({ _id: userFromDB._id }, { $set: { resetToken: resetToken, resetTokenExpiresAt: resetTokenExpiresAt } })
}

async function getUserByResetToken(resetToken) {
    return await client.db("SMA").collection("users").findOne({ resetToken: resetToken })
}

async function updateNewPassword(resetToken, hashedPassword) {
    return await client.db("SMA").collection("users").updateOne({ _id: resetToken._id }, { $set: { password: hashedPassword, resetToken: null, resetTokenExpiresAt: null } })
}

async function createNewPost(newpost) {
    return await client.db("SMA").collection("post").insertOne({ newpost,likes:0})
}
export { getUserByName, genPassword, createUser, getUserByEmail, genToken, storeResetToken, getUserByResetToken, updateNewPassword,createNewPost }