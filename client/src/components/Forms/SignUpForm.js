import React, { useState, useCallback } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useMutation } from 'react-query'
import axios from 'axios'
import Spinner from '../../assets/svg/Spinner'; 

const signUp = (data) => {
    return axios.post(`/api/user`, data)
}

const uploadPicture = (data) => {
    return axios.post(`https://api.cloudinary.com/v1_1/securing-future/image/upload`, data)
}

const SignUpForm = ({setisLoginForm}) => {
    const [showCpwd, setShowCPwd] = useState(false);
    const [showpwd, setShowPwd] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPwd] = useState('');
    const [cpwd, setCpwd] = useState('');
    const [pic, setPic] = useState();
    const [isUploadingPic, setIsUploadingPic] = useState(false);

    const { mutate } = useMutation(uploadPicture, {
        onSuccess: (data) => {
            setPic(data?.data?.secure_url);
            setIsUploadingPic(false);
        }
    }); 
 
    const { mutate: mutateSignUp } = useMutation(signUp, {
        onSuccess: (data) => {
            // localStorage.setItem("user", JSON.stringify(data));
            toast.success('Registration Successful!');
            setisLoginForm(true);
        },
        onError: (err) => {
            const error = JSON.parse(err?.request?.response)
            toast.error(`Error: ${error.err}`);
            console.log({err});
        }
    });

    const handleShowPwd = useCallback(() =>{
        setShowPwd(!showpwd);
    },[showpwd]) ;

    const handleShowCPwd = useCallback(() =>{
        setShowCPwd(!showCpwd);
    },[showCpwd]) 
    
    const postDetails = (pics) => {
        if(pics === undefined){
            toast.error('Please select an Image!');
            return;
        }
        if(pics.type === "image/jpeg" || pics.type === "image/png"){
            setIsUploadingPic(true);
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "securing-future");
            mutate(data);
        }else{
            toast.error('Please select an Image!');
        }
        
    }

    const handleSubmit = async() => {
        if(!name || !email || !password || !cpwd){
            toast.error('Please fill all the fields!');
            return;
        }
        if(password !== cpwd){
            toast.error('Password and confirm password do not match!');
            return;
        }

        mutateSignUp({name,email,password,pic})
    }

  return (
        <div className="bg-white py-10 px-6 rounded-xl shadow-ms w-full sm:max-w-[440px]">
        
            <h1 className="font-bold text-gray-800 text-[24px] mb-4">Sign up to your Account</h1>
            <div className="relative z-0 mb-6 w-full group">
                <input type="email" name="floating_email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-violet-500 focus:outline-none focus:ring-0 focus:border-violet-600 peer" placeholder=" " required onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="floating_email" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-focus:dark:text-violet-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email address</label>
            </div>
            <div className="relative z-0 mb-6 w-full group">
                <input type={showpwd  ? `text` : `password`} name="floating_password" id="floating_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-violet-500 focus:outline-none focus:ring-0 focus:border-violet-600 peer" placeholder=" " required onChange={(e) => setPwd(e.target.value)} />
                <label htmlFor="floating_password" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-focus:dark:text-violet-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Password</label>
                <button className="text-xs text-gray-700 absolute top-0 right-0 bottom-0 bg-gray-200 px-3 py-1 m-1 rounded-md" onClick={handleShowPwd}>{showpwd ? 'Hide' : 'Show'}</button>
            </div>
            <div className="relative z-0 mb-6 w-full group">
                <input type={showCpwd  ? `text` : `password`} name="repeat_password" id="floating_repeat_password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-violet-500 focus:outline-none focus:ring-0 focus:border-violet-600 peer" placeholder=" " required onChange={(e) => setCpwd(e.target.value)} />
                <label htmlFor="floating_repeat_password" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-focus:dark:text-violet-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
                <button className="text-xs text-gray-700 absolute top-0 right-0 bottom-0 bg-gray-200 px-3 py-1 m-1 rounded-md mb-2" onClick={handleShowCPwd}>{showCpwd ? 'Hide' : 'Show'}</button>
            </div>
            <div className="relative z-0 mb-6 w-full group">
                <input type="text" name="floating_name" id="floating_name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-violet-500 focus:outline-none focus:ring-0 focus:border-violet-600 peer" placeholder=" " required  onChange={(e) => setName(e.target.value)}/>
                <label htmlFor="floating_name" className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-focus:dark:text-violet-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
            </div>
            <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300" htmlFor="user_avatar">Upload picture.</label>
                    <input className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="user_avatar_help" id="user_avatar" type="file" onChange={(e) => postDetails(e.target.files[0])} accept="image/*"/>
                    {isUploadingPic && 
                    <div className='flex gap-2 items-center text-gray-700'>
                        <Spinner/>
                        <span>Uploading...</span>
                    </div>}
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-300" id="user_avatar_help">A profile picture is useful to confirm your are logged into your account</div>
                </div>
            <button type="submit" className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800"  onClick={handleSubmit}>Sign up</button>

            <p className='text-gray-400 text-sm text-center mt-5 font-medium'>Already have an account? <span className='underline cursor-pointer' onClick={() => setisLoginForm(true)} >Click here to Sign in!</span></p>
        </div>
  )
}

export default SignUpForm