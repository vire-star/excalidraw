import axios from "axios"
import { baseUrl } from "./baseUrl"

export const createDrawingApi = async(payload:string)=>{
    const res = await axios.post(`${baseUrl}/drawing/createDrawing`,
        payload,
        {
            headers:{'Content-Type':'application/json'},
            withCredentials:true
        }
    )
    return res.data
}

export const getDrawingApi = async(id:string)=>{
    const res = await axios.get(`${baseUrl}/drawing/getDrawing/${id}`,
     
        {
            headers:{'Content-Type':'application/json'},
            withCredentials:true
        }
    )
    return res.data
}

export const updateDrawingApi = async(payload,id)=>{
    const res = await axios.put(`${baseUrl}/drawing/updateDrawing/${id}`,
        payload,
        {
            headers:{'Content-Type':'application/json'},
            withCredentials:true
        }
    )
    return res.data
}