import React from 'react'
import ScrollableFeed from 'react-scrollable-feed';

  
  const isSameSender = (messages, m, i, userId) => {
    return (
      i < messages.length - 1 && 
      (messages[i + 1].sender?._id !== m.sender?._id || messages[i + 1].sender?._id === undefined) &&
   
      messages[i].sender?._id !== userId
      
    );
  };
  
 const isLastMessage = (messages, i, userId) => {
    return (
      i === messages.length - 1 &&
      messages[messages.length - 1].sender?._id !== userId &&
      messages[messages.length - 1].sender?._id
    );
  };

 
  
  const isSameSenderMargin = (messages, m, i, userId) => {
    // console.log(i === messages.length - 1);
  
    if (
      i < messages.length - 1 &&
      messages[i + 1].sender?._id === m.sender?._id &&
      messages[i].sender?._id !== userId
    )
      return 33;
    else if (
      (i < messages.length - 1 &&
        messages[i + 1].sender?._id !== m.sender?._id &&
        messages[i].sender?._id !== userId) ||
      (i === messages.length - 1 && messages[i].sender?._id !== userId)
    )
      return 0;
    else return "auto";
  };

//  const isSameUser = (messages, m, i) => {
//     return i > 0 && messages[i - 1].sender._id === m.sender._id;
//   };
  
 
const ScrollChat = ({ messages, user }) => {   

  return (
    
    <ScrollableFeed>

        {messages &&
            messages.map((m,i) => (
                <div className={`mt-2 w-full flex flex-nowrap items-center gap-2 font-medium relative ${isSameSender(messages, m, i, user?._id) || isLastMessage(messages,i,user?._id) ? `mb-8` : `mb-0`} `} key={i}>
                    {(isSameSender(messages, m, i, user?._id) || isLastMessage(messages,i,user?._id))
                    && 
                    (
                        <img src={m?.sender?.pic} alt="" className='self-end flex-shrink-0 w-[34px] h-[36px] rounded-full object-cover object-center'  />
                    )}
                    <div className={` ${isSameSenderMargin(messages,m,i,user?._id) === 33 ? `ml-[41px]` : isSameSenderMargin(messages,m,i,user?._id) === 0 ? `ml-[0px]` : `ml-auto`} flex-shrink-0`}>
                      
                      <div className={`${m?.sender?._id === user._id ? `bg-green-400` : `bg-[#4d426d]`}
                          py-[7px] px-[15px] rounded-3xl text-white text-xs md:text-sm w-full max-w-[250px] md:max-w-[350px]
                      `}>
                          <p>{m?.content}</p>
                      </div>
                     
                    </div>
                    {(isSameSender(messages, m, i, user?._id) || isLastMessage(messages,i,user?._id)) &&
                  
                        <span className='text-gray-100 text-xs font-light w-full'> - {m?.sender?.name}</span>
}
                </div>
            )) }
    </ScrollableFeed>
  )
}

export default ScrollChat