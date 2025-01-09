import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv'
import UserModel from "../models/user.js";


dotenv.config()

//-----------------------Google--------------------------------------------------------

passport.use(new GoogleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    callbackURL : 'http://localhost:3000/auth/google/callback',
},
async (accessToken,refreshToken,profile,done)=>{

    try {
        let rows = await UserModel.findUserByGoogleId(profile.id)
        console.log('datos',rows)

        if(rows){
            console.log('El usuario ya existe:', rows);

            return done(null,rows)
        }else{

            const newUser = {
                username: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                image: profile.photos[0].value
                }

                console.log('Creando un nuevo usuario:', newUser);

            
            const createUser = UserModel.addUserGoogle(newUser) 

            return done(null,createUser)
        }
        
    } catch (error) {
        return done(error, null);
        
    }
}
))

passport.serializeUser((user,done)=>done(null,user));


passport.deserializeUser(async (user,done)=>{
try {
    done(null,user)
} catch (err) {
    done(err,null)
}
})