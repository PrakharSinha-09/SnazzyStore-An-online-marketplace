import express from 'express';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
connectDB();
const PORT = 3000;
const app = express();
app.use(express.json());
//Importing Routes
import userRoute from './routes/user.js';
import productRoute from './routes/products.js';
//Using Route
app.use('/api/v1/user', userRoute);
app.use('/api/v1/product', productRoute);
//error handling middleware
app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log(`Server Running On ${PORT}`);
});
