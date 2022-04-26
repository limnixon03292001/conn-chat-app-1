import React,{createContext, useContext, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

import {checkToken} from '../utils/checkToken';

const ChatContext = createContext();


const ChatProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(false);
    const [notif, setNotif] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const navigate = useNavigate();
    const [socket, setSocket] = useState();
    const userInfo =  JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
          
            setUser(userInfo);
            // if(!checkToken){
            //     return navigate("/login", {replace: true});
            // }
            
    },[navigate]);

  return (
    <ChatContext.Provider value={{user, setUser, chats, setChats, selectedChat, setSelectedChat, notif, setNotif, onlineUsers, setOnlineUsers, socket, setSocket}}>
        {children}
    </ChatContext.Provider>
  )
}

export const userContext = () => {
    return useContext(ChatContext);
}

export default ChatProvider