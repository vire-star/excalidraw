import express from 'express'
import { createServer } from 'http'; 
import { ENV } from './src/config/env.js'
import userRoute from './src/routes/user.route.js'
import cookieParser from 'cookie-parser'
import { connectDb } from './src/config/db.js'
import drawingRoute from './src/routes/drawing.route.js'
import { initSocket } from './src/socket/socket.controller.js'
import rateLimit from 'express-rate-limit';
import cors from 'cors'
const app  = express()
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // 🔥 500 requests (development)
  message: 'Too many requests, please try again later.',
  skip: (req) => {
    // 🔥 Skip rate limit for localhost
    return req.ip === '::1' || req.ip === '127.0.0.1';
  }
});
app.use('/api', limiter);
app.use('/api', userRoute)
app.use('/api/drawing', drawingRoute)

const httpServer = createServer(app);

// ✅ INITIALIZE SOCKET.IO
const io = initSocket(httpServer);

httpServer.listen(ENV.PORT, () => {
    connectDb();
    console.log('🚀 Server + Socket.io started on port', ENV.PORT);
});
