import {compare} from 'bcrypt';
import UserModel from "../models/user.js";
import tokenModel from '../models/token.js';
import tokenService from "../services/tokenService.js";
import { randomBytes } from "crypto";
import handleError from "../utils/handleError.js";


class Authentication {

    static async login (req, res) {
        const {email,password} = req.body


        if(!email || !password){
            return res.status(400).json({message: "Email and password are required"})
        }

        try {

            const user = await UserModel.getUserByEmail(email)
            console.log(user.user_id)
            if(!user){
                return res.status(401).json({message: "Invalid email or password"})
                }

                 // Comparar la contraseña proporcionada con la almacenada en la base de datos
            const match = await compare(password, user.password);

            if(!match){
                return res.status(401).json({message: "Invalid email or password"})
            }

            const token = tokenService.generateToken(user.user_id,user.email,user.role,'1h')

            const refreshToken = tokenService.generateToken(user.user_id,user.email,user.role,'7d')

            
          const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);  // Expira en 7 días

         
         const saveRefreshToken = await tokenModel.saveRefreshToken(user.user_id,refreshToken,expiresAt)

       res.cookie('refreshToken',refreshToken,{
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite : 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
       })

       const randomCode = randomBytes(8).toString('hex');

       UserModel.insertLoginRecord(user.user_id,randomCode)
    

       res.status(200).json({
        message: "Login successful",
        token:token,
        refreshToken:refreshToken
       })
            
        } catch (error) {
            handleError(res,error)
            
        }


    }


    static async logout(req,res){
        const refreshToken = req.cookies.refreshToken

        if(!refreshToken){
            return res.status(401).json({message: "No refresh Token provided"})
        }
        try {
            const decoded = tokenService.verifyToken(refreshToken)

            if(!decoded){
                return res.status(401).json({message: "Invalid or expires refresh token"})
            }

            const result = await tokenModel.revocateToken(refreshToken)

            if(result.length===0){
                return res.status(401).json({message: "Refresh token not found"})
            }

            res.clearCookie('refresh')
            
        } catch (error) {
            handleError(res,error)
        }
    }
//function to generate a new access token with the referesh token   
    static async refreshToken (req,res){
        const  refreshToken = req.cookies.refreshToken
        if(!refreshToken){
        return res.status(400).json({error:'No refresh token provided'}) 
        }

        try {

            const decoded = tokenService.verifyToken(refreshToken)
            if(!decoded){
                return res.status(403).json({error:'Invalid or expired refresh token'})
            }

            const user = await UserModel.getUserById(decoded.id)
            if(!user || user.length===0){
                return res.status(404).json({error:'User not found '})
            }

            const tokenRecord = await tokenModel.verifyExistingToken(refreshToken,decoded.id)

            if(!tokenRecord || tokenRecord.length===0){
                return res.status(403).json({error:'Invalid or revoked refresh token'})
            }

            const newAccessToken = tokenService.generateToken(decoded.id,decoded.email,user.role,'1h')

            res.json({
                accessToken :  newAccessToken
            })
            
        } catch (error) {
            handleError(res,error)
        }


    }


    

}

export default Authentication;