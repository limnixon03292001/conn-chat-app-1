import decode from 'jwt-decode'
import { userContext } from '../context/ChatProvider';
export const checkToken = () => {
    // const {user} = userContext();


    const user = JSON.parse(localStorage.getItem("user"))
  
    if(user?.token || user){
        const decodedToken = decode(user?.token);

        if(decodedToken.exp * 1000 < new Date().getTime()){
        
            localStorage.removeItem('user');
            return false;
        }else{
            return true
        }
    } 
}