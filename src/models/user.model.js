import mongoose from "mongoose";
import jwt from  "jsonwebtoken";
import bcrypt from "bcrypt"


const userSchema = new Schema(
    {
        usarname: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        password: {
            type: string, 
            required: true
        }
    }, 
    {timestamps: true})


    userSchema.pre("save", async function (next) {
        if(!this.isModified("password")) return next();

        this.password = bcrypt.hash(this.password, 10)
        next()
    })

    userSchema.methods.isPasswordCorrect = async function (password) {
        return await bcrypt.compare(password, this.password)
    }

    userSchema.mothodes.generateAccessToken = function (){
        return jwt.sign(
            {
                _id: this._id,
                email: this.email,
                username: this.username,
                fullName: this.fullName
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    } 
    userSchema.mothodes.generateRefreshToken = function (){
        return jwt.sign(
            {
                _id: this._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    }

export const User = mongoose.model("User", userSchema)