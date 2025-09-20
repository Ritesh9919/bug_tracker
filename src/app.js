
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandlerMiddleware } from './middlewares/errorHandler.middleware.js';
import morgan from 'morgan'
// routers
import authRouter from './routes/auth.routes.js'
import bugRouter from './routes/bug.routes.js'

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(morgan("dev"))
app.get('/', (req, res)=> {
    res.send("Hello World");
})
app.use('/api/auth', authRouter);
app.use('/api/bugs', bugRouter);
app.use(errorHandlerMiddleware);

export {app}