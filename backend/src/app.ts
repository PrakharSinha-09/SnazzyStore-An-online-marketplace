import express from 'express'
import { connectDB } from './utils/features.js'
import { errorMiddleware } from './middlewares/error.js'
import NodeCache from 'node-cache'
import {config} from 'dotenv'
import morgan from 'morgan'

config({
    path: "./.env"
})

const PORT=process.env.PORT || 3000
connectDB(process.env.DATABASE_URL as string)

//will store the data in the RAM for the faster retrieval
export const nodeCache=new NodeCache();

const app=express()
app.use(express.json())
app.use(morgan("dev"))
 
//Importing Routes
import userRoute from './routes/user.js'
import productRoute from './routes/products.js'
import orderRoute from './routes/order.js'
import paymentRoute from './routes/payment.js'
import dashboardRoutes from './routes/admin-dashboard.js'

//Using Route
app.use('/api/v1/user',userRoute)
app.use('/api/v1/product',productRoute)
app.use('/api/v1/order',orderRoute)
app.use('/api/v1/payment',paymentRoute)
app.use('/api/v1/dashboard',dashboardRoutes)

app.use('/uploads',express.static("uploads"))

//error handling middleware
app.use(errorMiddleware)

app.listen(PORT,()=>{
    console.log(`Server Running On ${PORT}`);
    
})