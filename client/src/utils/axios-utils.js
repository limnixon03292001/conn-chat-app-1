import axios from "axios";

const instance = axios.create({baseURL: "https://conn-chat-web-app.herokuapp.com/"});

export const request = ({...options}) => {
    const user = JSON.parse(localStorage.getItem("user"));

        if(user?.token){
           instance.defaults.headers.common.Authorization = `Bearer ${user?.token}`;
        }
    //   const onSuccess = (response) => response;
    //   const onError = (error) => {
    //     const errorx = JSON.parse(error?.request?.response);
    //     toast.error(`Error: ${errorx.err}`);
    //   }
    
    return instance(options)
}

// .then(onSuccess).catch(onError)