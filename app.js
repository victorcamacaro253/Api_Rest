import express ,{json} from 'express';
import helmet from 'helmet';
import routes from './routes/index.js';
import cors from 'cors';
import morgan from 'morgan';

const app = express()

app.use(json())

app.use(cors())

app.use(helmet())

app.use(morgan('dev'))

app.disable('x-powered-by')

app.get('/',(req,res)=>{
    res.json({ message : 'hello world' })
})


app.use(routes)

const PORT = process.env.PORT ?? 3000


app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})