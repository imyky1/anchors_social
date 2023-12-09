const express = require('express')
const router = express.Router()
const Post = require('../models/Discussion')
const Comment = require('../models/Comment')
const isLoggedIn = require('../middleware/isLoggedin')

//API to see all posts
router.get('/all_posts',async(req,res)=>{
    console.log('all post')
    const foundpost = await Post.find().populate("postedBy","_id username")
    res.json({foundpost})
 })


//API to add a new post
router.post('/posts', isLoggedIn, async (req, res) => {
    try {
        let date = new Date().toUTCString().slice(5, 16);
        const { title, description } = req.body
        console.log(title,description)
        if (!title || !description) {
            return res.status(422).json({ error: "please enter all the fields" })
        }
        const newPost = new Post({ title: title, description: description, postedBy: req.user._id,date })
        await newPost.save()

        res.json(newPost)
    }
    catch(e){
        res.json({error:e.message})
    }
})

router.get('/comment/:id',async(req,res)=>{
    const foundcomment = await Comment.find({post:req.params.id}).populate("postedBy","_id username").populate("parentComment","date description")
    // console.log(foundcomment)
    
    res.json({foundcomment})
 })

router.post('/posts/:id/comments/',isLoggedIn,async(req,res)=>{
    try {
        let date = new Date().toUTCString().slice(5, 16);
        const Post_Id = req.params.id;
        const { description,ParentComment_Id } = req.body
        const foundpost = await Post.findById(Post_Id).populate('postedBy', '_id');
        if (!foundpost) {
            return res.status(422).json({ error: 'Post not found' });
        }
        console.log(description)
        if (!description) {
            return res.status(422).json({ error: "please enter all the fields" })
        }
        const newComment = new Comment({ description: description, postedBy:req.user._id, date, post:Post_Id, ParentComment:ParentComment_Id })
        await newComment.save()
        res.json(newComment)
    }
    catch(e){
        res.json({error:e.message})
    }
})


//API to see a particular post  
router.get('/posts/:id',isLoggedIn,async(req,res)=>{
    const foundpost = await Post.findById(req.params.id).populate("postedBy","_id username")
    res.json({foundpost})
 })


//API to update a post
router.put('/posts/:id/edit',isLoggedIn,async(req,res)=>{
    const {id} = req.params
    const {title,description} = req.body
    try{
        const foundpost = await Post.findByIdAndUpdate(id,{title,description},{new:true})
        res.json(foundpost)
    }
    catch(e){
        console.log(e)
        res.status(422).json({'error' : e})
    }
})

//API to delete a post
router.delete('/posts/:postId',isLoggedIn,async(req,res)=>{
    try {
        const foundpost = await Post.findById(req.params.postId).populate('postedBy', '_id');
        if (!foundpost) {
            return res.status(422).json({ error: 'Post not found' });
        }
        if (foundpost.postedBy._id.toString() === req.user._id.toString()) {
            const deletedpost =  await Post.deleteOne({ _id: req.params.postId });
            // console.log(foundpost)
            res.json(foundpost);
        } else {
            res.status(401).json({ error: 'Unauthorized: You can only delete your own posts' });
        }
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the post' });
    }

})

module.exports = router