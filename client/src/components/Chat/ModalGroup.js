import React, {Fragment, useState, useEffect} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import AddGroupUser from './AddGroupUser'
import { useMutation } from 'react-query'
import { request } from '../../utils/axios-utils';
import toast from 'react-hot-toast';
import { userContext } from '../../context/ChatProvider';

const changeNameGroup = (data) => {
  return request({url: `/api/chat/rename`, method: `put`, data: data});
}

const addUsers = (data) => {
  return request({url: `/api/chat/groupadd`, method: `put`, data: data});
}

const removeUsers = (data) => {
  return request({url: `/api/chat/groupremove`, method: `put`, data: data});
}

const ModalGroup = ({ isOpen, closeModal, selectedChat }) => {

    const [newUsers, setNewUsers] = useState([]);
    const [groupName, setGroupName] = useState(selectedChat?.chatName);  //  group name to be change
    const {chats, setChats,setSelectedChat} = userContext();
    //Change the name of group
    const { mutate: mutateChangeName } = useMutation(changeNameGroup,
      {
        onSuccess: ({data}) => {
            const datax = chats?.map((c) => {
            return c._id === data?._id ? data : c; 
            })
            setSelectedChat(data);
            setChats(datax);
            toast.success('Group name changed successfuly!');
            closeModal();
        },
        onError: (err) => {
          const error = JSON.parse(err?.request?.response);
          toast.error(`Error: ${error.err}`);
        }
      });

      //Add a users to group
      const { mutate: mutateAddUsers } = useMutation(addUsers,
        {
          onSuccess: ({data}) => {
              console.log(selectedChat.users);
              setSelectedChat({...selectedChat, users: data.users});
              toast.success('Successfuly Added!');
        },
        onError: (err) => {
          const error = JSON.parse(err?.request?.response);
          toast.error(`Error: ${error.err}`);
        }
      });

      //remove user
      const { mutate: mutateRemoveUsers } = useMutation(removeUsers,
        {
          onSuccess: ({data}) => {
              console.log(data);
              setSelectedChat({...selectedChat, users: data.users});
              toast.success('User has been removed!');
        },
        onError: (err) => {
          const error = JSON.parse(err?.request?.response);
          toast.error(`Error: ${error.err}`);
        }
      });

    useEffect(() => {
      return () =>  {
        setGroupName(selectedChat?.chatName)
      }
    },[closeModal])

    const handleChangeName = () => {
      mutateChangeName({chatName: groupName, chatId: selectedChat?._id});
    }

    const handleAddUsers = () => {
      let ids = newUsers.map((users) => {
        return users._id;
      })
      mutateAddUsers({userId: ids, chatId: selectedChat?._id});
    }

    const handleRemoveUser = (id) => {
      console.log(id)
      mutateRemoveUsers({userId: id, chatId: selectedChat?._id});
    }
    
  return (
    <Transition appear show={isOpen} as={Fragment}>
    <Dialog
      as="div"
      className="fixed inset-0 z-10 overflow-y-auto"
      onClose={closeModal}
    >
      <div className="min-h-screen px-4 text-center">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/20" />
        </Transition.Child>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="inline-block h-screen align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#5d5082] shadow-xl rounded-2xl">
            <Dialog.Title
              as="h3"
              className="text-[24px] font-medium leading-6 text-gray-100"
            >
                Settings
            </Dialog.Title>
            <div className='mt-2'>
                <h1 className="text-[16px] font-medium leading-6 text-gray-100 mb-2">Members<span className='text-gray-200 text-xs'> - Tip: Click users to remove.</span></h1>
                <div className='space-y-2 max-h-[240px] overflow-auto'>
                    {selectedChat?.users?.map((user,id) => (
                            <button key={id} className="inline-block w-full overflow-auto px-3 py-2 text-sm font-medium text-violet-900 bg-violet-500 border border-transparent rounded-full hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 " onClick={() => handleRemoveUser(user?._id)}>
                                <div className='gap-2' >
                                    <p className="text-[11px] text-white text-center">{user?.name}</p>
                                </div>
                            </button>
                    ))}
                </div>
            </div>
            <div className="w-full h-full mt-4 space-y-4">
                <div className='flex gap-2 items-center justify-center'>
                    <input type="text" id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 " placeholder="Group chat name" required value={groupName} onChange={(e) => setGroupName(e.target.value)}/>
                    <button
                    type="button"
                    className=" block px-4 py-2 text-sm font-medium text-violet-900 bg-violet-100 border border-transparent rounded-md hover:bg-violet-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 my-2 mx-2" onClick={handleChangeName}>
                    Change
                    </button>
                </div>

                <div className='w-full'>
                    <AddGroupUser setNewUsers={setNewUsers} newUsers={newUsers}/>
                </div>
                <div className='flex flex-nowrap items-center justify-end gap-2'>
                      <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-violet-900 bg-violet-100 border border-transparent rounded-md hover:bg-violet-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 "
                        onClick={handleAddUsers}>
                        Add users.
                      </button>
                      <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-violet-900 bg-violet-100 border border-transparent rounded-md hover:bg-violet-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 "
                      onClick={closeModal}>
                        Close.
                      </button>
                </div>
            </div>

          </div>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>
  )
}

export default ModalGroup