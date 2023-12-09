// Rudra Innovative project
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000
const dotenv = require('dotenv');
dotenv.config();

//Routers
const loginroutes = require('../Routes/Auth')
const postroutes = require('../Routes/Post')
//models
const User = require('../models/User')

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors())

mongoose.connect(process.env.DB_URL).then(()=>{
    console.log("mongo is connected")
}).catch((e)=>{
    console.log('error:',e)
})

//Routes Miiddelware
app.use('/',loginroutes)
app.use('/',postroutes)

app.listen(PORT,()=>{
    console.log("Listening on port 3000")
})