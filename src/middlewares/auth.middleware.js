import { User } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import { ApiError } from "../utils/apiError.js";


export const auth = async(req, res, next)=> {
    try {
        const {token} = req.cookies;
        if(!token) {
            next(new ApiError(401, "Unauthorized"));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id).select("-password");
        req.user = user;
        next();
    } catch (error) {
        console.error("auth",error);
        return res.status(401).json({success:false, message:error.message})
    }
}