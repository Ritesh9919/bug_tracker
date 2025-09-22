import {User} from '../models/user.model.js'
import { ApiError } from '../utils/apiError.js'
import {ApiResponse} from '../utils/apiResponse.js'


export const register = async(req, res, next)=> {
    try {
        const {email, password, name, role} = req.body;
        if(!name || !email || !password) {
            next(new ApiError(400, "All fields are required"));
        }
        const user = await User.findOne({email});
        if(user) {
            next(new ApiError(400, "User already registered"));
        }

        const newUser = await User.create({name, email, password, role:role ? role:"reporter"})
        return res.status(201).json(new ApiResponse(true, newUser, "User registered"))
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const login = async(req, res, next)=> {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            next(new ApiError(400, "Both fields are required"))
        }
        const user = await User.findOne({email});
        if(!user) {
            next(new ApiError(404, "User not found"));
        }

        const isPasswordMatch = await user.isPasswordCurrect(password);
        if(!isPasswordMatch) {
            next(new ApiError(401, "Invalid credentials"));
        }
        const token = user.generateAccessToken();
        res.cookie("token", token, {
            httpOnly:true,
            domain:process.env.DOMAIN,
            secure:process.env.NODE_ENV === "production" ? true:false,
            sameSite:process.env.NODE_ENV === "production" ? "none":"lax",
            path:'/'
            
        })
        return res.status(200).json(new ApiResponse(true, {}, "Login successfully"));
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const getMe = async(req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        return res.status(200).json(new ApiResponse(true, user, "user fetched"))
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const logout = async(req,res, next)=> {
    try {
        res.clearCookie("token", {
            httpOnly:true,
            secure:true,
        
        })
        res.json({});
    } catch (error) {
        console.error(error);
        next(error);
    }
}