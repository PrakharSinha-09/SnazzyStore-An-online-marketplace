import express from 'express'
import { adminOnly } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';
import { newProduct } from '../controllers/product.js';

const app=express.Router()

app.post('/new',singleUpload,newProduct)

export default app;