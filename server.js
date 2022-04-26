const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


// Deployment section
if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} 
//End Deployment section

const server = app.listen(process.env.PORT || 5000, console.log('Server is listening on PORT 5000'));


//Sockets realtime
const { instrument } = require("@socket.io/admin-ui");
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: ["http://localhost:3000", "https://admin.socket.io/"],
    },
})

// this variable stores the current online users we need to keep track the user
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
   return userId.map((u) => {
       return users.filter((user) => user.userId === u?._id);
   })
};

io.on("connection", (socket) => {
    //fires when a user connected
    console.log("User connected", socket.id);

     //take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    //send a and receive a message 
    socket.on("sendMessage", (newMessageReceived) => {
       
        const  users  = getUser(newMessageReceived?.chat?.users); 
        // console.log("user", users);
        users.forEach(user => {
            // console.log("socket:",)
            socket.to(user[0]?.socketId).emit("messageReceived", newMessageReceived);
            
        });
    
    });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

})

instrument(io, {
    auth: false
  });


//   socket.on('setup', (userData) => {
//     socket.join(userData?._id);
//     console.log('user data id:',userData?._id);
//     socket.emit('connected');
// }); 


    // socket.on('newMessage', (newMessageReceive, selectedChatId) => {
//     var chat = newMessageReceive.chat;
   
//     if(!chat?.users)  return console.log("no users inside the chat.")

//     
// });