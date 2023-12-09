const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')//for hashing the password
const nodemailer = require('nodemailer');//to send mail when forgot password
const User = require('../models/User')
const jwt = require('jsonwebtoken')//assigning token to the logged in user
const dotenv = require('dotenv');
dotenv.config();
const { JWT_SECRET } = process.env


// Send email notification
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS,
    },
  });


// Function to generate OTP
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP
}

//home page API
router.get("/", (req, res) => {
    res.send("Welcome to Anchor")
})

//Signup API
router.post('/signup', async (req, res) => {
    console.log(req.body)
    try {
        const { username, email, password,confirmPassword} = req.body
        if(!username){
            return res.status(422).json({ error: "username cannot be empty" })
        }
        if(!email){
            return res.status(422).json({ error: "email cannot be empty" })
        }
        if(!password || !confirmPassword){
            return res.status(422).json({ error: "password and confirm password cannot be empty" })
        }

        if(password != confirmPassword){
            return res.status(422).json({ error: "password and confirm password are not same" })
        }

        const founduser1 = await User.findOne({ email: email })
        if (founduser1) {
            console.log("email exit")
            return res.status(422).json({ error: "This email Already Exist" })
        }
        const founduser2 = await User.findOne({ username: username })
        if (founduser2) {
            return res.status(422).json({ error: "This username Already Exist" })
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        // Generate OTP
        const otp = generateOTP();
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            otp: otp, // Save the generated OTP to the User model
        });

        await newUser.save();

        // Send OTP via email
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Anchors - Verification OTP',
            text: `Your OTP for verification is: ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error sending email.' });
            }

            console.log('Email sent:', info.response);
            res.json({ message: 'Account created. OTP sent to your email for verification.' });
        });
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: e.message });
    }
});
// Verify OTP route
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        if (user.otp !== otp) {
            return res.status(422).json({ error: 'Invalid OTP.' });
        }

        // Clear OTP after successful verification (optional)
        user.otp = null;
        await user.save();

        res.json({ message: 'OTP verified successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

//Login API
router.post('/signin', async (req, res) => {
    try {
        const { username, password } = req.body
        const foundUser = await User.findOne({ username })
        if (!foundUser) {
            return res.status(422).json({ error: 'Invalid credentials' });
        }

        if (foundUser.otp) {
            return res.status(422).json({ error: 'OTP verification required.' });
        }
        const validated = await bcrypt.compare(password, foundUser.password)
        if (validated) {
            const { _id, username, email } = foundUser
            const token = jwt.sign({ _id: foundUser._id }, JWT_SECRET)
            res.json({ token: token, user: { _id, username, email } })
        }
        else {
            res.status(422).json({ error: "Invalid credentials" })
        }
    }
    catch (e) {
        res.status(422).json({ error: e.message })
    }
})

// Forgot Password API
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Generate reset token and set its expiry
        const resetToken = Math.random().toString(36).substr(2);
        //   const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

        user.resetToken = resetToken;
        //   user.resetTokenExpiry = resetTokenExpiry;

        await user.save();

        const mailOptions = {
            from: 'Rudra yash.20465@knit.ac.in',
            to: email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: http://rudra_innovative/reset/${resetToken}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error sending email.' });
            }

            console.log('Email sent:', info.response);
            res.json({ message: 'Password reset instructions sent to your email.' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});

module.exports = router