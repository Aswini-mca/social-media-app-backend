import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/users.js";
import { genPassword, getUserByName, getUserByEmail, genToken, storeResetToken, getUserByResetToken, updateNewPassword } from "../helpers.js";
import nodemailer from "nodemailer";

const router = express.Router()

//signup API
router.post('/signup', async (req, res) => {
    const { username, firstname, lastname, email, password, gender, dob } = req.body;
    let user = await getUserByName(req)

    //validate username & required fields
    if (user) {
        res.status(400).send({ error: "Username already exists" })
        return
    }
    if (!username) {
        res.status(400).send({ error: "Username field is required" })
        return
    }
    if (!firstname) {
        res.status(400).send({ error: "Firstname field is required" })
        return
    }
    if (!lastname) {
        res.status(400).send({ error: "Lastname field is required" })
        return
    }

    //validate email pattern
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        res.status(400).send({ error: "Email pattern does not match" })
        return
    }
    if (!password) {
        res.status(400).send({ error: "Password field is required" })
        return
    }

    //validate password pattern
    if (!/^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[#!@%$_]).{8,}$/g.test(password)) {
        res.status(400).send({ error: "Password pattern does not match" })
        return
    }

    //validate required fields
    if (!gender) {
        res.status(400).send({ error: "Gender is required" })
        return
    }
    if (!dob) {
        res.status(400).send({ error: "DOB is required " })
        return
    }
    const hashedPassword = await genPassword(password)

    user = new User({
        username,
        firstname,
        lastname,
        email,
        password: hashedPassword,
        gender,
        dob
    }).save();
    res.status(201).json({ message: "Successfully Created" })

})

//login API
router.post('/login', async (req, res) => {
    const userFromDB = await getUserByName(req)

    //validate username
    if (!userFromDB) {
        res.status(400).send({ error: "Invalid Credentials" })
        return
    }
    const storedDbPassword = userFromDB.password
    const isPasswordMatch = await bcrypt.compare(req.body.password, storedDbPassword)

    if (!isPasswordMatch) {
        res.status(400).send({ error: "Invalid Credentials" })
        return
    }
    const token = jwt.sign({ id: userFromDB._id }, process.env.secret_key)
    res.status(201).json({ message: "Login successfully", token })
})

// //forget password API
router.post('/forget-password', async (req, res) => {
    const { email } = req.body
    let userFromDB = await getUserByEmail(req)

    //validate username
    if (!userFromDB) {
        res.status(400).send({ error: "Invalid Credentials" })
        return
    }
    //generating random string
    const resetToken = genToken()
    const expirationTime = Date.now() + 60 * 60 * 1000 //Expires in 1 hour
    const resetTokenExpiresAt = new Date(expirationTime)
    const storeRandomStringDb = await storeResetToken(resetToken, userFromDB, resetTokenExpiresAt)

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.email,
            pass: process.env.password
        }
    });

    // Function to send the email
    const sendEmail = {
        from: process.env.email,
        to: email,
        subject: "Password Reset Link",
        text: `random string is${resetToken}`,
        html: `<h2>The link for reset your password will expire in 1 hour.<a href='https://steady-tulumba-e53b14.netlify.app/reset-password/${resetToken}'>https://steady-tulumba-e53b14.netlify.app/reset-password/${resetToken}</a></h2>`
    };

    transporter.sendMail(sendEmail, (err, info) => {
        if (err) {
            console.log("Error sending email", err)
            res.status(500).json({ error: "Email not sent" })
        }
        else {
            console.log("Email sent", info.response)
            res.status(200).json({ message: "Email sent successfully,click that Reset Password Link", resetToken })
        }
    })

})

//reset password API
router.post('/reset-password/:token', async (req, res) => {
    const token = req.params.token
    const { newPassword, confirmPassword } = req.body

    try {
        let resetToken = await getUserByResetToken(token)

        // Check if the reset token exists in the database
        if (!resetToken) {
            return res.status(404).json({ error: 'Invalid reset token' });
        }

        //validate required fields
        if (!newPassword) {
            res.status(400).send({ error: "New Password field is required" })
            return
        }
        if (!confirmPassword) {
            res.status(400).send({ error: "Confirm Password is required " })
            return
        }

        const currentTime = Date.now();
        const resetTokenExpiration = resetToken.resetTokenExpiresAt.getTime();

        // Check if the reset token has expired
        if (currentTime > resetTokenExpiration) {
            return res.status(400).json({ error: 'reset token has expired' });
        }

        //check newPassword pattern
        if (!/^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[#!@%$_]).{8,}$/g.test(newPassword)) {
            res.status(400).send({ error: "password pattern does not match" })
            return
        }

        //check newPassword and confirmPassword are same
        if (newPassword !== confirmPassword) {
            return res.status(404).json({ error: 'New password and confirm password are not same' });
        }
        else {

            // Update the user's password
            const hashedPassword = await genPassword(newPassword)
            const updatePassword = await updateNewPassword(resetToken, hashedPassword)
            return res.json({ message: 'Password reset successful' });
        }

    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})

export const usersRouter = router