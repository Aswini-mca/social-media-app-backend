import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { getUserByName,genPassword,createUser} from "../helpers.js";

const router = express.Router()
 
//signup API
router.post('/signup',async (req,res) => {
    const { username,firstname,lastname,email,password,gender,dob} = req.body;
    const isUserExist = await getUserByName(username)
  
    //validate username & required fields
    if (isUserExist) {
      res.status(400).send({ error: "Username already exists" })
      return
    }
    if(!username){
        res.status(400).send({ error: "Username field is required" })
        return 
    }
    if(!firstname){
        res.status(400).send({ error: "Firstname field is required" })
        return 
    }
    if(!lastname){
        res.status(400).send({ error: "Lastname field is required" })
        return 
    }

    //validate email pattern
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      res.status(400).send({ error: "Email pattern does not match" })
      return
    }
  
    //validate password pattern
    if (!/^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[#!@%$_]).{8,}$/g.test(password)) {
      res.status(400).send({ error: "Password pattern does not match" })
      return
    }

    //validate required fields
    if(!gender){
        res.status(400).send({ error: "Gender is required" })
        return 
    }
    if(!dob){
        res.status(400).send({ error: "DOB is required " })
        return 
    }
    const hashedPassword = await genPassword(password)
    const result = await createUser(username,firstname,lastname,email,hashedPassword,gender,dob)
    res.status(201).json({ message: "Successfully Created" })
    
})

//login API
router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const userFromDB = await getUserByName(username)
    
    //validate username
    if (!userFromDB) {
      res.status(400).send({ error: "Invalid Credentials" })
      return
    }
    const storedDbPassword = userFromDB.password
    const isPasswordMatch = await bcrypt.compare(password,storedDbPassword)
    
    if (!isPasswordMatch) {
      res.status(400).send({ error: "Invalid Credentials" })
      return
    }
    const token = jwt.sign({ id: userFromDB._id }, process.env.secret_key)
    res.status(201).json({ message: "Login successfully", token })
  })



export const usersRouter = router