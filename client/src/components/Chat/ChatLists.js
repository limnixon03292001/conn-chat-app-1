import React, { useState, useCallback, useEffect } from 'react';
import { userContext } from '../../context/ChatProvider';
import Modal from './Modal';
import { IoMdCreate, } from 'react-icons/io';
import { AiOutlineUser } from 'react-icons/ai';
import ModalCurrentUser from './ModalCurrentUser';
import Spinner from '../../assets/svg/Spinner';
import { RiChatSmile3Fill } from 'react-icons/ri';
import Header from '../Chat/Header';

const ChatLists = ({ isLoading }) => {

    const {chats, selectedChat, setSelectedChat, user, onlineUsers} = userContext();
    let [openCGroup, setOpenCGroup] = useState(false);
    let [openUInfo, setOpenUInfo] = useState(false);

    const getSender = useCallback((loggedUser, users) => {
        if(users){
            return users[0]?._id === loggedUser?._id ? users[1] : users[0];
        }
        return;
    });

    const checkOnline = (id) => {
      return onlineUsers.find((onlineUser) => onlineUser?.userId === id)
    }

  
    function closeModal(type) {
        if(type === 1){
            setOpenCGroup(false)
        } else if (type === 2) {
            setOpenUInfo(false)
        }
      return;
    }
  
    function openModal(type) {
        if(type === 1){
            setOpenCGroup(true)
        } else if (type === 2) {
            setOpenUInfo(true)
        }
      return;
    }     

  return (
    <div className={`h-full max-h-full px-3 pt-4 ${selectedChat ? `hidden` : `block`} md:block `}>
        <div>
            <div className='flex item-center justify-between border-b border-[#5d5082] py-4 px-2'>

                <div className='flex items-center gap-3'>
                    <img src={user?.pic} alt="" className='
                    w-[36px] h-[37px] md:w-[43px] md:h-[45px] rounded-full flex-shrink-0 object-center object-cover' />
                    <h1 className='text-[21px] md:text-[24px] font-semibold leading-6 text-white'>My Chats</h1>
                </div>
            
                <div className='space-x-3'>
                    <button className="shadow-md text-white bg-violet-600 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-full text-sm w-[37px] h-[37px] my-auto flex- items-center justify-center" type="button"
                    onClick={() => openModal(1)} ><IoMdCreate size={20} className="m-auto mb-[2px] "/></button>

                    <button className="shadow-md text-white bg-violet-600 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-full text-sm w-[37px] h-[37px] my-auto flex- items-center justify-center" type="button"
                    onClick={() => openModal(2)} ><AiOutlineUser size={20} className="m-auto mb-[2px]"/></button>
                </div>

                <Modal closeModal={closeModal} openCGroup={openCGroup}/>
                <ModalCurrentUser closeModal={closeModal} openUInfo={openUInfo}/>

            </div>
            <Header/>
        </div>
        <div className='max-h-[430px] overflow-auto'>
            <div className='max-h-full p-2 rounded-xl space-y-2 bg-[#5d5082]'>
                {isLoading ? <span className='text-gray-100 flex flex-nowrap items-center justify-center'><Spinner/> Fetching chats...</span> : 

                    chats.length === 0 ? 
                        <div className='flex flex-col h-full w-full text-gray-100 items-center justify-center space-y-2 p-3'>
                            <RiChatSmile3Fill size={44}/>
                            <p>No chat found.</p>
                            <p className='text-sm text-gray-200 text-center'>Create a group or search a user to start a conversation.</p>
                        </div>
                    :

                    chats.map((chat,id) => (
                        <div key={id} className={`${selectedChat?._id === chat?._id ? `bg-[#5d5082]/10 ` : ``} rounded-lg px-2 py-3 cursor-pointer space-y-2 flex gap-3 text-gray-800`}
                        onClick={() => setSelectedChat(chat)}>
                    
                            {!chat?.isGroupChat && 
                                <div className='flex-shrink-0 flex justify-center items-center relative'>
                                    <img src={getSender(user, chat?.users)?.pic} alt="" className='
                                    mt-auto w-[38px] h-[41px] rounded-full object-center object-cover' />
                                    {/* online-icon */}
                                    {checkOnline(getSender(user, chat?.users)?._id) ? <span className='bg-green-400 p-[6px] rounded-full absolute bottom-0 -right-1 border-2 border-[#5d5082]'></span> 
                                    : 
                                    <span className='bg-gray-400 p-[6px] rounded-full absolute bottom-0 -right-1 border-2 border-[#5d5082]'></span>}
                                </div>
                            }
                    
                        <div className='text-white tracking-wide'>
                            <h1 className='text-[12px] md:text-[14px] font-semibold antialiased '>
                                {!chat?.isGroupChat ? 
                                        getSender(user, chat?.users)?.name
                                        :
                                        chat?.chatName
                                    }
                                </h1> 
                                {chat?.latestMessage &&
                                    <div className='flex gap-1 text-[10px] md:text-xs text-gray-300 '>
                                        {chat?.latestMessage?.sender?._id !== user?._id ?    
                                        <p>{chat?.latestMessage?.sender?.name} 
                                        </p> : `You` } : 
                                        <span>{chat?.latestMessage?.content}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>

    </div>
  )
}

export default ChatLists