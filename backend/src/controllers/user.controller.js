import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js"
import bcrypt  from "bcryptjs"
import { ENV } from '../config/env.js'
import { Drawing } from '../models/drawing.model.js'
import { nanoid } from 'zod'
export const register = async(req,res)=>{
    try {
        
        const {username, email, password} = req.validatedData

        if(!username || !email || !password){
            return res.status(401).json({
                message:"Please provide all the details"
            })
        }

        const userExist = await User.findOne({email})

        if(userExist){
            return res.status(401).json({
                message:"User already exist"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        
            const drawing  = await Drawing.create({
            title: `Untitled Drawing - ${user.username}`,
           
            elements: [],
            appState: {
                zoom: { value: 1 },
                scrollX: 0,
                scrollY: 0,
                currentItemStrokeColor: '#1e1e1e',
                currentItemBackgroundColor: '#ffffff',
                currentItemRoughness: 1,
                selectedElementIds: [],
                viewBackgroundColor: '#ffffff'
            },
            version: 0,
            isPublic: false,
            ownerId: user._id
        });

        const user = await User.create({
            email, 
            username,
            password:hashPassword
        })

        const token = await jwt.sign({userId:user._id}, ENV.JWT_SECRET)
        return res.status(201).cookie("token",token,{ maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true,  secure: true, sameSite: "none"}).json({
            message:`${user.username} Registered successfully`,
            drawing
        })
    } catch (error) {
        console.log(`error from register, ${error}`)
    }
}


export const login = async(req,res)=>{
    try {
        const {email, password } = req.validatedData;

        if(!email || !password){
            return res.status(401).json({
                message:"Please provide all the details"
            })
        }

        const user = await User.findOne({email})

        if(!user){
            return res.status(401).json({
                message:"Invalid Email or Password"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect){
             return res.status(401).json({
                message:"Invalid Email or Password"
            })
        }


        const token = await jwt.sign({userId:user._id}, ENV.JWT_SECRET)
        // const key = nanoid(6)

             const drawing= await Drawing.create({
            title: `Untitled Drawing - ${user.username}`,
        //    key,
            elements: [],
            appState: {
                zoom: { value: 1 },
                scrollX: 0,
                scrollY: 0,
                currentItemStrokeColor: '#1e1e1e',
                currentItemBackgroundColor: '#ffffff',
                currentItemRoughness: 1,
                selectedElementIds: [],
                viewBackgroundColor: '#ffffff'
            },
            version: 0,
            isPublic: false,
            ownerId: user._id
        });

        return res.status(201).cookie("token",token,{ maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true,  secure: true, sameSite: "none"}).json({
            message:`${user.username} logged in successfully`,
            drawing
        })

    } catch (error) {
        console.log(`error from Login ${error}`)
    }
}


export const getUser = async(req, res)=>{
    try {
        const userId  = req.id;

        const token = req.cookies.token
        
        const user = await User.findById(userId)

        
        if(!user){
            return res.status(401).json({
                message:"User not found"
            })
        }

        return res.status(201).json(
            {
                user,
                token
            }
        )
    } catch (error) {
        console.log(`error from getUser, ${error}`)
    }
}