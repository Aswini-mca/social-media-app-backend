import express from "express";
import { deletePost, getAllPost, getUserPost, newPost, updatePost } from "../helpers.js";
const router = express.Router()

//new post API
router.post('/user/new-post', async (req, res) => {
    const { newpost } = req.body
    const post = await newPost(req)
    try {
        //validate new post
        if (!newpost) {
            res.status(400).send({ error: "Post field is required" })
            return
        }
        if (!post) {
            return res.status(400).send({ error: "Error occured while saving the post" })
        }

        res.status(201).json({ data: post, message: "Post saved successfully" })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }

})

//get all post API
router.get('/all', async (req, res) => {
    try {
        const post = await getAllPost()

        if (!post) {
            return res.status(404).send({ error: "post not avilable" })
        }
        res.status(200).json({ data: post })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });

    }

})

//get user post API
router.get('/user/all', async (req, res) => {
    try {
        const post = await getUserPost(req)

        if (!post) {
            return res.status(404).send({ error: "post not avilable" })
        }
        res.status(200).json({ data: post })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });

    }

})

//update post API
router.put('/user/edit/:id', async (req, res) => {
    try {
        const updatedpost = await updatePost(req)

        if (!updatedpost) {
            return res.status(404).send({ error: "Error occured while updating the post" })
        }
        res.status(201).json({ data: updatedpost, message: "Updated successfully" })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });

    }

})

//delete post API
router.delete('/user/delete/:id', async (req, res) => {
    try {
        const deletepost = await deletePost(req)

        if (!deletepost) {
            return res.status(404).send({ error: "Error occured while deleting the post" })
        }
        res.status(201).json({ message: "Post Deleted successfully" })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });

    }

})

export const postRouter = router