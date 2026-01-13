import axios from 'axios'
import { baseUrl } from './baseUrl';
export const registerApi=async(data: { email: string; password: string, username:string })=>{
    const res  = await axios.post(`${baseUrl}/register`,
        data,
        {
            headers:{'Content-Type':'application/json'},
            withCredentials:true
        }
    )
    return res.data
}
export const loginApi=async(data: { email: string; password: string})=>{
    const res  = await axios.post(`${baseUrl}/login`,
        data,
        {
            headers:{'Content-Type':'application/json'},
            withCredentials:true
        }
    )
    return res.data
}
export const getUserApi=async()=>{
    const res  = await axios.get(`${baseUrl}/getUser`,
       
        {
            headers:{'Content-Type':'application/json'},
            withCredentials:true
        }
    )
    return res.data
}