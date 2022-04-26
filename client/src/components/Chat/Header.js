import React, { useEffect, useState } from 'react';
import { userContext } from '../../context/ChatProvider';
import Search from './Search';
import {IoMdNotifications, IoMdSearch} from 'react-icons/io';

const Header = () => {
    const { notif, setNotif, setSelectedChat } = userContext();
    const [noNotifx, setNotifx] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(()=>{
        setNotifx(notif.length);
    },[notif]);
     
    const setChat = (chat) => {
         const newNotif = notif.filter((n) => {
           return n?.notif?.chat?._id !== chat?.chat?._id
        });

        setNotif(newNotif);
        setSelectedChat(chat?.chat);
        setOpen(false);
    }

  return (
    <div className='w-full inline-block'>
        <nav className='w-full my-5'>
            <div className='flex w-full items-center justify-between gap-8'>
                <Search IoMdSearch={IoMdSearch}/>
                <div className='relative'>
                    <button className='relative mr-2 md:mr-0 text-white' onClick={() => setOpen(!open)}>
                        <IoMdNotifications size={30}/>
                        {noNotifx !== 0 && 
                           <span className='absolute top-0 bg-red-500 border border-[#5d5082] text-xs text-white py-[1px] px-[6px] rounded-full'>{noNotifx}</span>
                        }
                    </button>
                    {/* Notification container */}
                    {open && 
                    
                        <div className='absolute top-12 right-0 w-[200px] max-h-[250px] overflow-auto shadow-md bg-[#5d5082] py-3 rounded-xl text-gray-100 space-y-2'>
                        {noNotifx !== 0 ?
                            notif?.map((n,id) => (
                                <div className='text-left cursor-pointer mx-2 flex items-center gap-3' key={id} onClick={() =>
                                setChat( n?.notif)}>
                                    
                                    <img src={n?.notif?.sender?.pic} className='w-[34px] h-[36px] rounded-full flex-shrink-0 object-cover object-center' />
                                <p className='text-sm break-words'>{`New message from ${n?.notif?.sender?.name}`}</p>
                                </div>
                                // New message from ${newMessageReceived.sender.name}
                            ))
                            :
                                <div className='text-gray-100 text-sm px-3'>
                                    No notification found...
                                </div>
                            }
                        </div>
                    }

                </div>

            </div>
        </nav>
    </div>
  )
}

export default Header