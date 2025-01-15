import { Router } from "express";
import Authentication from "../controllers/authentication.js";
import passport from "passport";
const router = Router();

router.post("/login", Authentication.login);

router.post('/logout',Authentication.logout)

router.post('/refreshToken',Authentication.refreshToken)


//----------------------------------Google-----------------------------------------------------

router.get('/google',passport.authenticate('google',{scope:['profile','email']}))


router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/'}),(req,res)=>{
    res.redirect('/profile')
})


router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    }
    res.json({
      message: 'Perfil del usuario',
      user: req.user  // Passport guarda la información del usuario en req.user
    });
  });



router.get('/logout',(req,res)=>{
    req.logout(()=>{
        req.redirect('/')
    })
})


//-----------------------------Facebook-----------------------------------------------------------------


router.get('/facebook',passport.authenticate('facebook',{scope:['email']}));

router.get('/facebook/callback',passport.authenticate('facebook',{failureRedirect:'/'}),
(req,res)=>{
  res.redirect('/profile')
}
)


//------------------------Github------------------------------------------------------------------------------

router.get('/github',passport.authenticate('github',{scope:['user:email']}))

router.get('/github/callback',passport.authenticate('github',{failureRedirect:'/'}),
(req,res)=>{

  res.redirect('/profile')
  
}
)

//--------------------Twitter----------------------------------------------------------------------------------

// Ruta para iniciar sesión con Twitter
router.get('/twitter', passport.authenticate('twitter'));

// Ruta de callback de Twitter
router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/' }),
  (req, res) => {
    // Redirige al usuario a su perfil o a donde necesites
    res.redirect('/profile');
  }
);



export default router;