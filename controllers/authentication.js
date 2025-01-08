import {compare} from 'bcrypt';
import UserModel from "../models/user.js";
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

            
         // const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);  // Expira en 7 días

         
       //  const saveRefreshToken = await tokenModel.saveRefreshToken(user.id,refreshToken,expiresAt)

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

}

export default Authentication;