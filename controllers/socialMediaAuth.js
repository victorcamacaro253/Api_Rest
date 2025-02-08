import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as TwitterStrategy } from 'passport-twitter';
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

            
            const createUser = await UserModel.addUserGoogle(newUser) 
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
console.log(user)
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

        console.log(newUser)
        user = await UserModel.addUserFacebook(newUser);  
        return done(null, user);
      }
    } catch (error) {
      return done(error, null);
    }
  }
));


//---------------------------Github------------------------------------------------------------------------

passport.use(new GitHubStrategy({
  clientID : process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/github/callback',
  scope:['user:email'],

},
async (accessToken,refreshToken,profile,done)=>{
  console.log(profile)
  try {
    let user = await UserModel.getUserByGithubId(profile.id)
    if(user){
      return done(null,user)
    }else{
      const email= (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : null 

      const newUser = {
        github_id: profile.id,
        username: profile.displayName,
        email: email,
        image: profile.photos[0].value,
      }

      user = await UserModel.addUserGithub(newUser)
      console.log(user)
      return done(null,user)
    }
  } catch (error) {
    return done(error,null)
  }
}
))

//-------------------------Twitter-----------------------------------------------------------------------------

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: 'http://localhost:3000/auth/twitter/callback',
  includeEmail: true 
},
  async (token, tokenSecret, profile, done) => {
    console.log(profile)
    try {
      let user = await UserModel.getUserByTwitterId(profile.id)

      if(user){

        return done(null,user)

        }else{
            
          const newUser = {
            twitter_id: profile.id,
            username: profile.displayName,
            email: profile.emails ? profile.emails[0].value : null,
            image: profile.photos[0].value,
            }
            user = await UserModel.addUserTwitter(newUser)
            console.log(user)
            return done(null,user)
          }
    } catch (error) {
      return done(error,null)
      
    }
    }
  ))

//-------------------------------------------------------------------------------------------------------------

passport.serializeUser((user,done)=>done(null,user));


passport.deserializeUser(async (user,done)=>{
try {
    done(null,user)
} catch (err) {
    done(err,null)
}
})