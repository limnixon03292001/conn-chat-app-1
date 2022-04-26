const asyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req,res) => {
    const {name, email, password, pic} = req.body;

    if(!name || !email || !password){
        res.status(400).json({err:"User already exists"})
    }

   
    try {
        const userExists = await User.findOne({ email });

        if(userExists) {
            return res.status(400).json({err:"Email already exist!"})
        }

        const user = await User.create({
            name,
            email,
            password,
            pic,
        });

        if(user){
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id),
            })
        }else {
            res.status(400).json({err:"Failed to create User"})
        }
        
    } catch (error) {
        res.status(400).json({err: error?.message})
    }
    
});


const authUser = asyncHandler(async (req,res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user){
           return res.status(400).json({err:"Email doesn't exist!"});
        }
    
        const auth = await bcrypt.compare(password, user.password);
    
        //fires when password is incorrect
        if(!auth){
            return res.status(400).json({err:"Password is incorrect!"});
        }
        
        // if all goods then authorize the user
        res.status(200).json({
            _id: user._id,
            email: user.email,
            name: user.name,
            pic: user.pic,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(400).json({err:"Failed to log in"})
    }
});

const allUsers = asyncHandler(async(req,res) => {
    const keyword = req.query.search ?
    {
        $or: [
            {name: {$regex: req.query.search, $options: "i" }},
            {email: {$regex: req.query.search, $options: "i" }}
        ],
    }
    :
    {};
    const users = await User.find(keyword).find({_id: {$ne: req.user.id}});
    res.status(200).json(users);
})


module.exports = {registerUser, authUser, allUsers}