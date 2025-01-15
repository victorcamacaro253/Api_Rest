import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
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
        let rows = await UserModel.getUserByGoogleId(profile.id)
      //  console.log('datos',rows)

        if(rows){
            console.log('User Already exist:', rows);

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



//----------------------------Facebook---------------------------------------------------------------------------
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'emails', 'photos'] // Campos a obtener
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Verificar si el usuario ya existe
      console.log(profile.id)
      let user = await UserModel.getUserByFacebookId(profile.id);

      if (user) {
        // Usuario ya existe, continuar
        return done(null, user);
      } else {
        // Crear un nuevo usuario
        const newUser = {
          facebook_id: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
          image: profile.photos[0].value
        };

        user = await UserModel.addUserFacebook(newUser);
        return done(null, user);
      }
    } catch (error) {
      return done(error, null);
    }
  }
));



passport.serializeUser((user,done)=>done(null,user));


passport.deserializeUser(async (user,done)=>{
try {
    done(null,user)
} catch (err) {
    done(err,null)
}
})