import React from 'react'
import useAuth from './useAuth'
import axios from '../api/axios'
const useLogout = () => {
    const {setAuth} = useAuth()


    const logout = async () => {
        setAuth({})
        try{
            const response = await axios.get('/logout', {
                withCredentials: true
            });
        } catch (err) {
            console.log(err)
        }

    }
  return logout;
}

export default useLogout
