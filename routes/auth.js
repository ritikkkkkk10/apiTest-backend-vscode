const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');

//gbhbuhbyugbhhhhhhhhhhhhhhhhhhhhh

authRouter.post('/api/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ msg: "Please enter all fields" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ msg: "User with the same email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save the user
        let user = new User({ fullName, email, password: hashedPassword });
        user = await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, "passwordKey");

        // Exclude password from response
        const { password: _, ...userWithoutPassword } = user._doc;

        // Respond with token and user data (without password)
        res.json({ token, ...userWithoutPassword });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//signin api end point

authRouter.post('/api/signin', async(req, res) => {
    try {
        const {email, password} = req.body;
        const findUser = await User.findOne({email});
        if(!findUser) {
            return res.status(400).json({msg : "User not found with this email"});
        } else {
            const isMatch = await bcrypt.compare(password, findUser.password);
            if(!isMatch) {
                return res.status(400).json({msg: 'Incorrect Password'});
            } else {
                //to sign in users we will use a package, go to terminal and type "npm i jsonwebtoken" and click enter thhen import here using 'require' as in top
                const token = jwt.sign({id: findUser._id}, "passwordKey");

                //below statement will extract password leaving other infos so it doesnt get returned as its sensitive and the rest info is stored in "userWithoutPassword" variable
                const {password, ...userWithoutPassword} = findUser._doc;

                //send the response
                res.json({token, ...userWithoutPassword});
            }
        }
    } catch(error) {
        res.status(500).json({error: error.message});
    }
})

module.exports = authRouter;