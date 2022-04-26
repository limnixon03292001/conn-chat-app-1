const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");


const accessChat = asyncHandler(async(req,res) => {
    const { userId }= req.body;

    if(!userId) {
        console.log("No user Id found!");
        return res.status(400).json({err: "No userId found!"});
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user.id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    }).populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });
    // console.log(isChat)
    if(isChat.length > 0 ) {
        res.status(200).json(isChat[0]);
    } else {
        var chatData = {
            chatName: "Senderx",
            isGroupChat: false,
            users: [req.user.id, userId],
        };

        try {
            const createChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id: createChat._id}).populate("users", "-password");
            res.status(200).json(fullChat);
        } catch (error) {
            res.status(400).json({err: "Something went wrong in creating chat."})
        }
    }
});

const fetchChats = asyncHandler(async(req,res) => {
    try {
        Chat.find({users:{ $elemMatch: { $eq: req.user.id} } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({_id: -1})
        .then(async(results) => {
            results = await User.populate(results,{
                path: "latestMessage.sender",
                select: "name pic email"
            });
            res.status(200).send(results);
        }); 
    } catch (error) {
         res.status(400).json({err: "Something went wrong in fetching chats."})
    }
})

const createGroupChat = asyncHandler(async(req,res) => {
    if(!req.body.users || !req.body.name){

       return res.status(400).json({err: "Please fill all the fields!"});
    }
    
    var users = req.body.users;

    if(users.length < 2){
        return res.status(400).json({err: "Please add 2 more users to form a group chat!"});
    }

    //add already logged user to the array
    users.push(req.user.id);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user.id
        });

        const fullGroupChat = await Chat.findOne({_id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password");

        res.status(200).send(fullGroupChat)
    } catch (error) {
       res.status(400).json({err: "Something went wrong in creating a group chat."});
    }
})

const renameGroup = asyncHandler(async(req,res) => {
    const {chatName, chatId} = req.body;

    if(!chatName){
        return res.status(400).json({err: "Group Chat name is required!"});
    }

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName
            },
            {
                new: true
            }
        ).populate("users", "-password").populate("groupAdmin", "-password")
        
        if(!updatedChat) {
            return res.status(404).json({err: "Group chat not found."})
        } else {
            res.status(200).send(updatedChat);
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({err:"Someting went wrong in renaming group Chat"})
    }
});

const addToGroup = asyncHandler(async(req,res) => {
    const {userId ,chatId} = req.body;

    if(!userId){
        return res.status(400).json({err: "Please fill to add user."});
    }

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $addToSet: { users: userId}
            },
            {
                new: true
            }
        ).populate("users", "-password").populate("groupAdmin", "-password")
        
        if(!updatedChat) {
            return res.status(404).json({err: "Group chat not found."})
        } else {
            res.status(200).send(updatedChat);
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({err:"Someting went wrong in renaming group Chat"})
    }
});

const removeFromGroup = asyncHandler(async(req,res) => {
    const {userId, chatId} = req.body;

    if(!userId){
        return res.status(400).json({err: "No user selected to remove."});
    }

    try {
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userId}
            },
            {
                new: true
            }
        ).populate("users", "-password").populate("groupAdmin", "-password");
              
        if(!updatedChat) {
            return res.status(404).json({err: "Group chat not found."})
        } else {
            res.status(200).send(updatedChat);
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({err:"Someting went wrong in renaming group Chat"})
    }
});



module.exports = {
    accessChat,
    fetchChats, 
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup
};