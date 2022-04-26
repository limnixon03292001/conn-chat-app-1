import React, { useState, useCallback, useEffect } from 'react'
import { useMutation } from 'react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const logIn = (data) => {
  return axios.post(`/api/user/login`, data)
}

const LoginForm = ({setisLoginForm}) => {

  const [showpwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPwd] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      navigate("/", {replace:true})
    }
  },[]);

  const { mutate } = useMutation(logIn, {
    onSuccess: (data) => {
      localStorage.setItem("user",JSON.stringify(data?.data));
      toast.success('Login Successful!');
      navigate("/", {replace:true})
    },
    onError: (err) => {
        const error = JSON.parse(err?.request?.response)
        toast.error(`Error: ${error.err}`);
    }
  });

    const handleShowPwd = useCallback(() =>{
      setShowPwd(!showpwd);
    },[showpwd]);

    const handleSubmit = (e) => {
      e.preventDefault();
      if(!email || !password){
        toast.error('Please fill all the fields!');
        return;
      }
     mutate({email,password});
  }


  return (
    <div className="bg-white py-10 px-6 rounded-xl shadow-ms w-full sm:max-w-[440px]">
      
        <h1 className="font-bold text-gray-800 text-[24px] mb-4">Sign in to your Account</h1>
  
        <div className="relative z-0 mb-6 w-full group">
            <input type="email" name="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-violet-500 focus:outline-none focus:ring-0 focus:border-violet-600 peer" placeholder=" " required onChange={(e) => setEmail(e.target.value)} />
            <label htmlFor="floating_email" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-focus:dark:text-violet-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
        </div>
        <div className="relative z-0 mb-6 w-full group">
            <input type={showpwd  ? `text` : `password`} name="floating_password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-violet-500 focus:outline-none focus:ring-0 focus:border-violet-600 peer" placeholder=" " required  onChange={(e) => setPwd(e.target.value)} />
            <label htmlFor="floating_password" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-focus:dark:text-violet-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
            <button className="text-xs text-gray-700 absolute top-0 right-0 bottom-0 bg-gray-200 px-3 py-1 m-1 rounded-md mb-2" onClick={handleShowPwd}>{showpwd ? 'Hide' : 'Show'}</button>
        </div>
       
        <button type="submit" className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" onClick={(e) => handleSubmit(e)}>Login</button>


        <p className='text-gray-400 text-sm text-center mt-5 font-medium'>Don't have an account? <span className='underline cursor-pointer' onClick={() => setisLoginForm(false)}>Sign up here!</span> </p>
    </div>
  )
}

export default LoginForm