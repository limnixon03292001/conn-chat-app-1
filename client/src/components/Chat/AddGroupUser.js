import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { request } from '../../utils/axios-utils';
import { userContext } from '../../context/ChatProvider';

const fetchChats = ({ queryKey }) => {
    const data = queryKey[1]
    return request({url:`/api/user?search=${data}`})
}

const AddGroupUser = ({ setNewUsers, newUsers }) => {

    const [input, setInput] = useState('');
    const {onlineUsers} = userContext();

    const addNewUser = (user) => {
        if(!newUsers.find(users => users._id === user._id)){
            setNewUsers([user, ...newUsers]);
        } else{
            return
        }

    }
    const removeNewUser = (id) => {
        const filteredUsers = newUsers.filter(nUsers => nUsers._id !== id);
        
        setNewUsers(filteredUsers)
    }

    const {data} = useQuery(['searchUser', input], fetchChats,
    {
        enabled: Boolean(input)
    });

    const checkOnline = (id) => {
        return onlineUsers.find((onlineUser) => onlineUser?.userId === id)
    }
    
  return (
    <div className='w-full h-max max-h-content'> 
        <div className='relative w-full '>
            <input type="text" placeholder='Search user to add...' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5  'onChange={(e) => setInput(e.target.value)} value={input} />
        
            {/* Added user */}
              {newUsers.length > 0 && <>
              
                <p className="text-sm text-gray-100 my-3">
                   Added User.
                </p>
                <div className='flex flex-wrap gap-2'>
                    {newUsers?.map((user,id) => (
                        <button key={id} className="w-full max-w-[120px] overflow-auto text-sm font-medium text-violet-900 bg-violet-500 border border-transparent rounded-full hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 flex items-center gap-2 py-1" onClick={() => removeNewUser(user?._id)}>
                                <span className='flex-shrink-0 ml-1'><img src={user?.pic} alt="" className='w-[27px] h-[27px] rounded-full object-cover'/></span>
                                <p className="text-[11px] text-white break-normal">{user?.name}</p>
                        </button>
                    ))}
                    </div>
              </>}
             
          
            <button type="button" className='max-h-[390px] mt-1 w-full overflow-y-auto overflow-x-hidden'>
            {data?.data.map((user,id) => (
                    <div className='px-3 py-3 cursor-pointer text-gray-100' key={id} onClick={() => addNewUser(user)}>
                            <div className='flex items-center gap-3'>
                                <img src={user?.pic} alt="" className='w-[37px] h-[38px] object-center object-cover rounded-full flex-shrink-0' />
                                <div>
                                <p>{user.name}</p>
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
            </button>


        </div>
    </div>
  )
}

export default AddGroupUser