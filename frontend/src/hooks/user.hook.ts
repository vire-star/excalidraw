import { useMutation, useQuery } from '@tanstack/react-query'
import { getUserApi, loginApi, registerApi } from '../Api/user.api'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export const useRegisterhook = ()=>{
    const navigate   = useNavigate()
    return useMutation({
        mutationFn:registerApi,
        onSuccess:(data)=>{
            console.log(data)
            toast.success(data.message)
            navigate(`/home/${data.drawing._id}`)
        },
        onError:(err)=>{
            console.log(err)
             toast.error(err?.response.data.message)
        }
    })
}
export const useLoginhook = ()=>{
    const navigate = useNavigate()
    return useMutation({
        mutationFn:loginApi,
        onSuccess:(data)=>{
            console.log(data)
            toast.success(data.message)
             navigate(`/home/${data.drawing._id}`)
        },
        onError:(err)=>{
            console.log(err)
            toast.error(err?.response.data.message)
        }
    })
}

export const useGetUserHook = ()=>{
    return useQuery({
        queryKey:['getUser'],
        queryFn:getUserApi
    })
}