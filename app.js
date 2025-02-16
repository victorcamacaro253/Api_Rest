import express ,{json} from 'express';
import helmet from 'helmet';
import routes from './routes/index.js';
import authentication from './routes/authRoutes.js'
import limiter from './middleware/rateLimiter.js';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import './controllers/socialMediaAuth.js';  // Asegúrate de que se configure passport



const app = express()


// Swagger configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API documentation using Swagger',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
            },
        ],
    },
    apis: ['./routes/**/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);


app.use(json())

app.use(cors())

// Configuración de la sesión
app.use(session({
    secret: 'victorcamacaro',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }  // Cambia a true en producción con HTTPS
  }));
  
  // Inicializa passport y sesiones
  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(helmet())

app.use(morgan('dev'))

app.use(limiter);


app.disable('x-powered-by')

app.use(authentication)

app.use(routes)


app.get('/',(req,res)=>{
    res.json({ message : 'hello world' })
})


const PORT = process.env.PORT ?? 3000


app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})