import mongoose from 'mongoose';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  role:{
    type:String,
    enum:["reporter","admin"]
  }
},{timestamps:true});

// hashing password before saving to db
userSchema.pre("save", async function(next){
  if(!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
})

// validating the password with saved password in db
userSchema.methods.isPasswordCurrect = async function(password) {
  return await bcrypt.compare(password, this.password);
}

// generating access token
userSchema.methods.generateAccessToken = function(){
  return jwt.sign({_id:this._id}, process.env.JWT_SECRET, {expiresIn:"1d"})
}

export const User = mongoose.model("User", userSchema);