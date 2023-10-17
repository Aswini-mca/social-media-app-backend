import { client } from "./index.js";
import bcrypt from "bcrypt"


async function genPassword(password) {
    const salt = await bcrypt.genSalt(15) // bcrypt.genSalt(no. of rounds)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
}

async function createUser(username,firstname,lastname,email,hashedPassword,gender,dob) {
    return await client.db("SMA").collection("users").insertOne({ username,firstname,lastname,email,password:hashedPassword,gender,dob})
}

async function getUserByName(username) {
    return await client.db("SMA").collection("users").findOne({ username: username })
}

export {getUserByName, genPassword,createUser}