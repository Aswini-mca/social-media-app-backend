import express from "express";
import { createNewPost } from "../helpers.js";
const router = express.Router()

//new post API
router.post('/new-post', async (req, res) => {
    const { newpost} = req.body

    const status = await createNewPost(newpost)

    //validate new post
    if (!newpost) {
        res.status(400).send({ error: "Post field is required" })
        return
    }
   
    res.status(201).json({ message: "Posted successfully", status })
})




export const postRouter = router