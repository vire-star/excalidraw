import express from 'express'
import { createServer } from 'http'; 
import { ENV } from './src/config/env.js'
import userRoute from './src/routes/user.route.js'
import cookieParser from 'cookie-parser'
import { connectDb } from './src/config/db.js'
import drawingRoute from './src/routes/drawing.route.js'
import { initSocket } from './src/socket/socket.controller.js'
import rateLimit from 'express-rate-limit';

const app  = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per IP
    message: 'Too many requests, please try again later'
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
