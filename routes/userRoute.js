const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { OAuth2Client } = require('google-auth-library');
const Client = new OAuth2Client("839291234313-4g4ledigi5l12p33o7foes0rsq3hv49l.apps.googleusercontent.com")
router.post('/register', async (req, res) => {

    try {
        const newuser = new User(req.body);
        const user = await newuser.save();
        res.json({ message: "User Registered Successfully" });
    } catch (error) {
        res.json({ message: "Registration Failed" });
    }
});

router.post('/login', async (req, res) => {
    const {email,password}=req.body;
    try {
        const temp = await User.findOne({ email: email})
        // console.log(temp)
        if (temp) {
            const pass = await User.findOne({ password: password })
            if(pass){
                res.json({ message: "successfully logged in", temp })
            }else {
                res.json({ message: "incorrect password" })
            }
        } else {
            res.json({ message: "User not found" })
        }
    } catch (error) {
        res.status(400).json({ message: "Login Failed" })
    }
});

router.post('/googleauth', async (req, res) => {
    const { TokenId } = req.body;
    // console.log(TokenId)
    try {

        Client.verifyIdToken({ idToken: TokenId, audience: "839291234313-4g4ledigi5l12p33o7foes0rsq3hv49l.apps.googleusercontent.com" }).then(response => {
            const { email_verified, name, email } = response.payload;
            // console.log(response.payload)
            if (email_verified) {
                User.findOne({ email }).exec(async (err, user) => {
                    if (err) {
                        return res.status(400).json({ error: "something went wrong....!" })
                    } else {
                        if (user) {
                            // console.log(user)
                            try {
                                const temp = await User.findOne({ email: user.email })
                                if (temp) {
                                    res.json({ message: "successfully logged in", temp })
                                } else {
                                    res.json({ message: "incorrect password" })
                                }
                            } catch (error) {
                                res.status(400).json({ message: "Login Failed" })
                            }
                        } else {
                            let password = TokenId;
                            try {
                                let newuser = new User({ email, username:name, password });
                                const temp = await newuser.save();
                                res.json({ message: "User Registered Successfully", temp });
                            }catch (error) {
                                res.json({ message: "Registration Failed" });
                            }
                            
                        }
                    }
                })
            }
        })
    } catch (error) {
        res.status(400).json({ message: "Login Failed" })
    }
});

module.exports = router;