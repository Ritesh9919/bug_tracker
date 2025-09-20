
import {Bug} from '../models/bug.model.js'
import {ApiError} from '../utils/apiError.js'
import {ApiResponse} from '../utils/apiResponse.js'


export const createBug = async(req, res, next)=> {
    try {
        const {title, description, severity, status} = req.body;
        if(!title || !description){
            next(new ApiError(400, "All fields are required"));
        }
        const bug = await Bug.create({title, description, severity:severity ? severity:"low", status:status ? status : "open", reporter:req.user._id})
        return res.status(200).json(new ApiResponse(true, bug, "Bug created"))
    } catch (error) {
        console.error(error);
        next(error);
    }
}


export const getAllBugs = async(req, res, next)=> {
    const {title, severity, status} = req.query;
    const query = {};
    if(title) query.title = {$regex:title, $options:'i'};
    if(severity) query.severity = severity.toLowerCase();
    if(status) query.status = status.toLowerCase()
    try {
        if(req.user.role === "admin") {
        const bugs = await Bug.find(query);
        return res.status(200).json(new ApiResponse(true, bugs, "Bugs fetched"))
        }
        const bugs = await Bug.find({reporter:req.user._id, ...query});
        return res.status(200).json(new ApiResponse(true, bugs, "Bugs fetched"))
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const updateBug = async(req, res, next)=> {
    try {
        const {bugId} = req.params;
        const {title, description, severity, status} = req.body;
        const updated = {};
        if(title) updated.title = title;
        if(description) updated.description = description;
        if(severity) updated.severity = severity;
        if(status) updated.status = status;
        const bug = await Bug.findById(bugId);
        if(req.user._id.equals(bug.reporter) || req.user.role === "admin") {
           const updatedBug = await Bug.findByIdAndUpdate(
            bugId,
            {$set:updated},
            {new:true}
           )
           return res.status(200).json(new ApiResponse(true, updatedBug, "updated"))
        }else{
            next(new ApiError(401, "You can not other's bug if you are not admin"));
        }

    } catch (error) {
        console.error(error);
        next(error);
    }
}