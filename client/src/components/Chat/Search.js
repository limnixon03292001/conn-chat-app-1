import React, { useState } from 'react'
import { useMutation, useQuery } from 'react-query'
import { request } from '../../utils/axios-utils'
import { userContext } from '../../context/ChatProvider'

const fetchChats = ({ queryKey }) => {
    const data = queryKey[1]
    return request({url:`/api/user?search=${data}`})
}

const createChat = (userId) => {
    return request({url:`/api/chat`, method: 'post', data: {userId: userId}});
}

const Search = ({ IoMdSearch }) => { 
    const [input, setInput] = useState('');
    const [userId, setUserId] = useState(''); //this state is for creating or accessing chat
    const {chats,setChats, onlineUsers, setSelectedChat} = userContext();
    
    const { data } = useQuery(['searchUser', input], fetchChats,
    {
        enabled: Boolean(input)
    });

    const { mutate } = useMutation(['createChat', userId], createChat,
    {
        onSuccess: (data) => {
           
           if(!chats.find((c) => c._id === data?.data?._id)){
                setChats([data?.data, ...chats]);
                setInput('');
           } else {
                //if user is already in the chat then we are going to select the chat
                setSelectedChat(data?.data);
                setInput('');
           }
          
        }
    });

    const checkOnline = (id) => {
        return onlineUsers.find((onlineUser) => onlineUser?.userId === id)
    }
    
  return (
    <div className='w-full max-w-[340px]'> 
        <div className='relative w-full '>
            <div className='relative'>
                <input type="text" placeholder='Search...' className='text-white pl-9 text-sm focus:ring-violet-400 focus:border-violet-400 block w-full p-2.5 bg-[#5d5082] placeholder:text-gray-200 rounded-3xl'
                onChange={(e) => setInput(e.target.value)} value={input} />
                <IoMdSearch size={23} className="absolute top-0 bottom-0 left-0 text-white ml-2 my-auto"/>
            </div>
            
            <div className='bg-[#5d5082] shadow-md rounded-xl max-h-[390px] z-20 absolute mt-1 w-full overflow-y-auto overflow-x-hidden'>
                {data?.data.map((user,id) => (
                    <div className='px-3 py-3 cursor-pointer text-gray-100' key={id} onClick={() => mutate(user?._id)}>
                            <div className='flex items-center gap-3'>
                                <img src={user?.pic} alt="" className='w-[34px] h-[36px] rounded-full flex-shrink-0 object-cover object-center' />
                                <div>
                                <p className='text-sm md:text-md'>{user.name}</p>
                                    {checkOnline(user?._id) ? 
                                        <div className='flex items-center text-xs'>
                                        <span className='flex-shrink-0 bg-green-400 p-[6px] rounded-full border-2 border-[#5d5082]'></span>
                                        Online.
                                        </div>
                                        : 
                                        <div className='flex items-center text-xs'>
                                        <span className='flex-shrink-0 bg-gray-400 p-[6px] rounded-full border-2 border-[#5d5082]'></span>
                                        Offline.
                                        </div>
                                    }
                                </div>
                            </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  )
}

export default Search