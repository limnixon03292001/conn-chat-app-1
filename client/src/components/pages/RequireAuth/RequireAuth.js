import React from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import {checkToken} from '../../../utils/checkToken';
const RequireAuth = () => {
    const location = useLocation();

  return (
  checkToken() ? 
        <Outlet/>
    :
        <Navigate to="/login"  state={{ from: location }} replace/>
  )
}

export default RequireAuth