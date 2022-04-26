import React, { useCallback, Fragment, useState ,useEffect} from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { userContext } from '../../context/ChatProvider'

const ModalSingle = ({ isOpen, closeModal, selectedChat }) => {

    const  {user} = userContext();
    const [info, setInfo] = useState({})


    const getSender = useCallback((loggedUser, users) => {
      if(users){
          return users[0]?._id === loggedUser?._id ? users[1] : users[0];
      }
      return;
    },[info]);
    
    useEffect(() => {
      
        let infoData = getSender(user, selectedChat?.users) 
        setInfo({name: infoData?.name, pic: infoData?.pic})

        return () => {
            setInfo({});
        }

    },[isOpen]);

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
            <Dialog.Title as="h3" className="text-[17px] font-medium leading-6 text-gray-100">
                User Information
            </Dialog.Title>
            <div className='mt-5 text-center'>
              <img src={info.pic} alt="profile_pic" className='m-auto mb-2 w-full w-[56px] h-[57px] rounded-full object-cover object-center'/>
              <h1 className="text-[16px] font-medium leading-6 text-gray-100 mb-2">
                  {info?.name}
              </h1>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>
  )
}

export default ModalSingle