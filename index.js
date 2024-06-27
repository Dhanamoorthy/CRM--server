import express from 'express'
import dotenv from 'dotenv'
import './db.js'
import cors from 'cors'
import './models/User.js'
import { AdminRouter } from './routes/auth.js'
import cookieParser from 'cookie-parser'


const app = express()
app.use(cookieParser());
dotenv.config()
//middleware



app.use(express.json());
app.use(cors({
    origin:['http://localhost:3000'],
    credentials:true
}))


//Define a route

app.use('/auth',AdminRouter)

//start the server

app.listen(process.env.PORT, ()=>{
    console.log('Server is Running')
})