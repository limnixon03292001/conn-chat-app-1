import React, { useCallback, useState, useEffect } from 'react'
import ModalGroup from './ModalGroup';
import ModalSingle from './ModalSingle';
import toast from 'react-hot-toast';
import {request} from '../../utils/axios-utils';
import { useMutation, useQuery } from 'react-query';
import ScrollChat from './ScrollChat';
import { userContext } from '../../context/ChatProvider';
import { IoMdSettings, IoMdArrowBack } from 'react-icons/io';
import { AiOutlineUser } from 'react-icons/ai';
import { RiChatSmile3Fill } from 'react-icons/ri';
import Spinner from '../../assets/svg/Spinner';
import io from 'socket.io-client';

const ENDPOINT = "https://conn-chat-web-app.herokuapp.com/";
var selectedChatCompare;
var socket;
const sendMessagesToServer = (data) => {
  return request({url: `/api/message`, method: `post`, data: data});
}

const fetchMessages = ({ queryKey }) => {
  const data = queryKey[1];
  return request({url: `/api/message/${data}`, method: `get`});
}

const Chat = ({ selectedChat, user, setSelectedChat, refetch }) => {

  let [isOpen, setIsOpen] = useState(false);
  const [newMessage, setnewMessage] = useState(''); // state for users input message
  const [messages, setMessages] = useState([]);
  const {notif, setNotif, onlineUsers, setOnlineUsers, setSocket} = userContext();


  useEffect(() => {
    socket = io(ENDPOINT);
    setSocket(socket)
    socket.emit("addUser", user?._id)
    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
    });

  },[]);
  
  useEffect(() => {
    selectedChatCompare = selectedChat;
  },[selectedChat]);

  useEffect(() => {
    socket.on("messageReceived", (newMessageReceived) => {
      if(!selectedChatCompare || selectedChatCompare?._id !== newMessageReceived?.chat._id){
          refetch();
          setNotif([{notif:newMessageReceived},...notif]); 

      } else {
        setMessages([...messages, newMessageReceived])
        }
    })
  }) 

    //React queries
  const { isLoading } = useQuery(['messages', selectedChat?._id],fetchMessages,
  {
  enabled: Boolean(selectedChat),
  onSuccess : ({data}) => {
    setMessages(data);
    // socket.emit('joinChat', selectedChat._id);
  }
  });

  const { mutate } = useMutation(sendMessagesToServer,{
    onSuccess: ({data}) => {
      setnewMessage('');
      socket.emit("sendMessage",data)
      // console.log(data?.chat?.users); user?._id, data?.chat?.users , data?.content)
      setMessages([...messages, data]);
    },
    onError: (err) => {
      const error = JSON.parse(err?.request?.response);
      toast.error(`Error: ${error.err}`);
    }
  });

  
  const getSender = useCallback((loggedUser, users) => {
    if(users){
        return users[0]?._id === loggedUser?._id ? users[1] : users[0];
    }
    return;
  });

  const checkOnline = (id) => {
    return onlineUsers.find((onlineUser) => onlineUser?.userId === id)
  }
  
  const inputHandler = (e) => {
    setnewMessage(e.target.value);
  }

  const sendMessage = (e) => {
    e.preventDefault();
    mutate({content: newMessage,chatId: selectedChat?._id });
  }

  const closeModal = useCallback(() => {
    setIsOpen(false)
  },[])

  const openModal = useCallback(() => {
    setIsOpen(true)
  },[])


  return (
      <div className={`${!selectedChat ? `hidden` :  ``}  md:flex-none w-full placeholder:h-full md:mt-6 bg-[#5d5082] md:rounded-3xl`}>
         <div>
           <div className='tracking-wide px-5 py-4 flex items-center justify-between gap-4 text-white border-b border-violet-400 '>
              <div>
                <h1 className=' text-lg md:text-[20px] font-semibold leading-6 mb-1'>
                  {!selectedChat?.isGroupChat ? 
                      getSender(user, selectedChat?.users)?.name 
                      :
                      selectedChat?.chatName
                    }
                  </h1>
                  {!selectedChat?.isGroupChat ?
                    checkOnline(getSender(user, selectedChat?.users)?._id) ? 
                        <div className='flex items-center text-[13px] gap-1'>
                          <span className='bg-green-400 p-[6px] rounded-full font-medium text-gray-300'></span> Active now.
                        </div>  
                        : 
                        <div className='flex items-center  text-[13px] gap-1'>
                          <span className='bg-gray-400 p-[6px] rounded-full text-gray-300'></span> Offline.
                        </div> 
                    :
                    null 
                  }
              </div>
              <div className='flex flex-nowrap gap-2'>
                    <button type="button" className="shadow-md text-white bg-violet-600 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-full text-sm w-[37px] h-[37px] my-auto flex- items-center justify-center block md:hidden" onClick={() => setSelectedChat('')}> <IoMdArrowBack size={20} className="m-auto mb-[2px]"/> </button>
                    <button type="button" className="shadow-md text-white bg-violet-600 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-full text-sm w-[37px] h-[37px] my-auto flex- items-center justify-center" onClick={openModal}>
                      {selectedChat?.isGroupChat ? <IoMdSettings size={22} className="m-auto mb-[1px]"/> : <AiOutlineUser size={20} className="m-auto mb-[2px]"/>}
                    </button>
                    {selectedChat?.isGroupChat &&  <ModalGroup closeModal={closeModal} isOpen={isOpen} selectedChat={selectedChat}/> }
                    
                    {!selectedChat?.isGroupChat && <ModalSingle closeModal={closeModal} isOpen={isOpen} selectedChat={selectedChat}/> }
              </div>
            </div>

                  {/* chat part */}
           <div className='rounded-md h-full w-full '>
              <div className='w-full h-[500px] md:h-[460px]'>
                    {isLoading ? 
                      <div className='w-full h-full flex items-center justify-center'>
                        <Spinner/>
                        <p className='font-medium text-center text-gray-100'>Collecting messages...</p>
                      </div>
                      :
                      //render messages
                      <div className='w-full max-h-full h-[500px] md:h-[460px] pl-2 pr-2 py-2'>
                       {messages.length !== 0 ? <ScrollChat messages={messages} user={user} className="overflow-x-hidden"/> 
                       : 
                          <div className='flex flex-col h-full w-full items-center justify-center space-y-2 p-3 text-gray-100'>
                            <RiChatSmile3Fill size={44}/>
                            <p className='text-sm text-white'>Start a conversation by sending a message.</p>
                          </div>
                        } 
                      </div>
                    }
              </div>
              <form className='w-full relative' onSubmit={(e) => sendMessage(e)}>
                  <input type="text" id="text" className="bg-[#5d5082] border border-violet-300 text-sm text-gray-100 focus:ring-violet-500 focus:border-violet-300 block w-full p-4 placeholder:text-gray-100 rounded" placeholder="Send a message." required value={newMessage} onChange={inputHandler}/>
              </form>
           </div>
         </div>
      </div>
  )
}

export default Chat