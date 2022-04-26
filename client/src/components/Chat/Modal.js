import React, { useState, Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import AddGroupUser from './AddGroupUser'
import { userContext } from '../../context/ChatProvider'
import { useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { request } from '../../utils/axios-utils'

const createGroupChat = (data) => {
  return request({url:`/api/chat/group`, method: 'post', data: data});
}

const Modal = ({closeModal, openCGroup}) => {

  const {chats,setChats} = userContext();
  const [newUsers, setNewUsers] = useState([]); // list of to add users when creating group chat
  const [groupName, setGroupName] = useState('');

  const { mutate } = useMutation(createGroupChat,
  {
      onSuccess: (data) => {
         if(!chats.find((c) => c._id === data?.data?._id)){
          setChats([data?.data, ...chats]);
         }
         toast.success(`Group chat successfuly created!`);
      },
      onError: (err) => {
        const error = JSON.parse(err?.request?.response);
        toast.error(`Error: ${error.err}`);
      }
  });

  const handleCreateGroup = (e) => {  
    e.preventDefault();
    mutate({
      users: newUsers,
      name: groupName
    })
  }

  return (
    <Transition appear show={openCGroup} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={()=>closeModal(1)}
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
                  className="text-xl md:text-[24px] font-medium leading-6 text-gray-100 mb-6"
                >
                  Create new Group Chat.
                </Dialog.Title>
                <div className="space-y-4">
                    <div>
                        <input type="text" id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5" placeholder="Group chat name" required value={groupName} 
                        onChange={(e) => setGroupName(e.target.value)} />
                    </div>
                    <div>
                        <AddGroupUser setNewUsers={setNewUsers} newUsers={newUsers}/>
                    </div>
                </div>

                <div className="mt-2 space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-violet-900 bg-violet-100 border border-transparent rounded-md hover:bg-violet-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 "
                    onClick={(e) => handleCreateGroup(e)}>
                      Create group chat.
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-violet-900 bg-violet-100 border border-transparent rounded-md hover:bg-violet-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-violet-500 "
                    onClick={() => closeModal(1)}>
                      Close.
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
  )
}

export default Modal