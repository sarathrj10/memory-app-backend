const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require("../models/user");

const signIn = async (req,res) => {
    const {email,password} = req.body
    console.log(email,password)
    try{
        const existingUser = await User.findOne({email})
        if(!existingUser) return res.status(200).json({success :false ,message:"User doesn't exist"})
        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password)
        if(!isPasswordCorrect) return res.status(200).json({success :false,message:"Invalid credentials"})
        const token = jwt.sign({email:existingUser.email,id:existingUser._id},"secret",{expiresIn:'1h'})
        res.status(200).json({success :true,result:existingUser,token})
    }catch(e){
        res.status(500).json({message:"something went wrong"})
    }
}

const signUp = async (req,res) => {
    const {email,password,confirmPassword,firstName,lastName} = req.body
    try{
        const existingUser = await User.findOne({email})
        if(existingUser) return res.status(200).json({success :false,message:"User already exist"})
        if(password !== confirmPassword) return res.status(200).json({success :false,message:"Password mismatch"})
        const hashedPassword = await bcrypt.hash(password,10)
        const result = await User.create({email,password:hashedPassword,name: `${firstName} ${lastName}`})
        const token = jwt.sign({email:result.email,id:result._id},"secret",{expiresIn:'1h'})
        res.status(200).json({success :true,result,token})
    }catch(e){
        res.status(500).json({message:"something went wrong"})
    }
}

module.exports ={
    signIn,
    signUp
}