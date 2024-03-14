import express from 'express'
import { adminOnly } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';
import { deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getLatestProducts, getProductDetail, newProduct, updateProductDetail } from '../controllers/product.js';

const app=express.Router()

app.post('/new',adminOnly,singleUpload,newProduct)

//through this endpoint, we can get all the products with the filters as sent by the user.
app.get('/all',getAllProducts)

app.get('/latest',getLatestProducts)

app.get('/categories',getAllCategories)

app.get('/admin-products',adminOnly,getAdminProducts)

app.get('/:id',getProductDetail)

app.put('/:id',adminOnly,singleUpload,updateProductDetail)

app.delete('/:id',adminOnly,deleteProduct)


export default app;