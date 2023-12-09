const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    date:{
        type:String
    },
    description: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post :{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    parentComment:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }
})

module.exports = new mongoose.model('Comment', postSchema)