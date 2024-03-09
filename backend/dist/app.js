import express from 'express';
import userRoute from './routes/user.js';
import { connectDB } from './utils/features.js';
import { errorMiddleware } from './middlewares/error.js';
connectDB();
const PORT = 3000;
const app = express();
app.use(express.json());
//Using Route
app.use('/api/v1/user', userRoute);
//error handling middleware
app.use(errorMiddleware);
app.listen(PORT, () => {
    console.log(`Server Running On ${PORT}`);
});
