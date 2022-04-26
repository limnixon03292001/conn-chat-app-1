import React, { useEffect }  from 'react'
import { userContext } from '../../context/ChatProvider'
import Header from '../../components/Chat/Header'
import ChatLists from '../Chat/ChatLists'
import Chat from '../Chat/Chat'
import { useQuery } from 'react-query'
import { request } from '../../utils/axios-utils'
import { IoLogoSnapchat } from 'react-icons/io'

const fetchChats = () => {
  return request({url:`/api/chat`})
}

const ChatPage = () => {
  
  const { selectedChat, user, setChats, setSelectedChat } = userContext();

  const {isLoading,refetch } = useQuery(['chats'], fetchChats,
  {
      onSuccess: (data) => {  
          setChats(data?.data);
      }
  })

  return (
      <div className='w-full h-full max-w-[1200px] mx-auto md:grid md:grid-cols-[400px_1fr] md:gap-3 '>
          <div>
            <ChatLists isLoading={isLoading} />
          </div>
          {user &&
            <div>
              <Chat selectedChat={selectedChat} user={user} setSelectedChat={setSelectedChat} refetch={refetch}/> 
              {!selectedChat && 
                <div className='hidden md:flex md:flex-col h-full w-full text-gray-100 items-center justify-center space-y-2 p-3'>
                  <IoLogoSnapchat size={44}/>
                  <p>No selected chat</p>
                  <p className='text-sm text-gray-400'>Select a chat or search a user to start a converstation.</p>
                </div>
              }
            </div>
          }
      </div>
  )
}

export default ChatPage