import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { userContext } from '../../context/ChatProvider'
import { useNavigate } from 'react-router-dom'


const ModalCurrentUser = ({ openUInfo, closeModal}) => {

    const { user, setUser, setChats, setSelectedChat, setNotif, socket } = userContext();
    const navigate = useNavigate();

    const logout = () => {
      localStorage.removeItem("user");
      setUser();
      setChats([]);
      setNotif([]);
      setSelectedChat(false);
      socket.disconnect();
      navigate("/login", {replace: true});
    }
  return (
    //   This component display the information about the current user logged in
    <Transition appear show={openUInfo} as={Fragment}>
        <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => closeModal(2)}
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
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden align-middle transition-all transform bg-[#5d5082] shadow-xl rounded-2xl text-gray-100 text-center">
            <Dialog.Title as="h3" className="text-[18px] font-medium leading-6 mb-4 ">
                User Information
            </Dialog.Title>
            <div className='mb-4 text-gray-100'>
                <img src={user?.pic} alt="" className='
                w-[53px] h-[55px] rounded-full flex-shrink-0 object-center object-cover inline-block mx-auto mb-2' />
                <p>{user?.name}</p>
                <p>{user?.email}</p>
            </div>
            <button
              type="button"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-900 bg-violet-100 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 "
              onClick={logout}>
                Logout.
            </button>
          </div>
        </Transition.Child>
      </div>
     </Dialog>
    </Transition>
  )
}

export default ModalCurrentUser