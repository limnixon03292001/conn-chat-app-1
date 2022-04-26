const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async(req,res) => {
    const {content, chatId } = req.body;

    if(!content || !chatId) {
       return res.status(400).json({err: "Invalid data request"});
    }

    var newMessage = {
        sender: req.user.id,
        content: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");

        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email"
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message
        })

        res.status(200).json(message);
    } catch (error) {
        return res.status(400).json({err: "Something went wrong."});
    }
})

const allMessages = asyncHandler(async(req,res) => {
    const chatId = req.params.chatId;
    try {

        const messages = await Message.find({chat: chatId}).populate("sender", "name pic email").populate("chat");
        res.status(200).json(messages);

    } catch (error) {
        return res.status(400).json({err: "Something went wrong."});
    }
})



module.exports = { sendMessage, allMessages };