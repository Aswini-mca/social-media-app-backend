import express from "express";
import { createComment, deletePost, getAllPost, getComments, getPostById, getTotalCounts, getUserPost, newPost, updateCommentCount, updateLike, updatePost } from "../helpers.js";
const router = express.Router()

//new post API
router.post('/user/new-post', async (req, res) => {
    const { newpost } = req.body
    try {
        //validate new post
        if (!newpost) {
            res.status(400).send({ error: "Post field is required" })
            return
        }
        const post = await newPost(req)
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

//get post by id API
router.get('/all/:id', async (req, res) => {
    try {
        const post = await getPostById(req)

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
    const { newpost } = req.body
    try {
        //validate new post
        if (!newpost) {
            res.status(400).send({ error: "Post field is required" })
            return
        }
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

//post comment  API
router.post('/user/comment/:id', async (req, res) => {
    const { comment } = req.body
    try {
        //validate comment
        if (!comment) {
            res.status(400).send({ error: "Comment field is required" })
            return
        }
        const createcomment = await createComment(req)
        if (!createcomment) {
            return res.status(400).send({ error: "Error occured while saving the comment" })
        }
        //update commentCount 
        await updateCommentCount(req)
        res.status(201).json({ data: createcomment,postId: req.params.id , message: "Comment saved successfully" })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }

})

//to get comments API
router.get('/user/comments/:id', async (req, res) => {
    try {
        const comment = await getComments(req)

        if (!comment) {
            return res.status(404).send({ error: "comments not avilable" })
        }
        res.status(200).json({ data: comment})
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });

    }
})

//update like count API
router.put('/user/like/:id', async (req, res) => {
    try {
        const updatedlike = await updateLike(req)

        if (!updatedlike) {
            return res.status(404).send({ error: "Error occured while updating the post" })
        }
        res.status(201).json({ data: updatedlike, message: "like Updated successfully" })
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });

    }

})

//to get total likeCount & commentCount of each post
router.get('/totalLikes/totalComments', async (req, res) => {
    try {
        const total = await getTotalCounts()

        if (!total) {
            return res.status(404).send({ error: "Total counts are not avilable" })
        }
        res.status(200).json({ data: total})
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });

    }
})

export const postRouter = router