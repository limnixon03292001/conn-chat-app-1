import React, {useState} from 'react'
import LoginForm from '../Forms/LoginForm'
import SignUpForm from '../Forms/SignUpForm'


const HomePage = () => {
  const [isLoginForm, setisLoginForm] = useState(true);
  return (
    <div className="flex items-center justify-around w-full h-full max-w-full p-3">
      {isLoginForm ? <LoginForm setisLoginForm={setisLoginForm} /> : <SignUpForm setisLoginForm={setisLoginForm}/> }
      
      {/* <div className="mt-2"></div> */}
      {/* <h1 className='text-gray-100 text-3xl font-semibold'>Welcome to Conn-chat!</h1> */}
    </div>
  )
}

export default HomePage;