import express from 'express'
import { ENV } from './src/config/env.js'
import userRoute from './src/routes/user.route.js'
import cookieParser from 'cookie-parser'
import { connectDb } from './src/config/db.js'
import drawingRoute from './src/routes/drawing.route.js'


const app  = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api', userRoute)
app.use('/api/drawing', drawingRoute)

app.listen(ENV.PORT,()=>{
    connectDb()
    console.log('server started on port', ENV.PORT)
})
