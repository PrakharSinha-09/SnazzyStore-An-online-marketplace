import express from 'express'
import { deleteUser, getAllUsers, getUser, newUser } from '../controllers/user.js';
import { adminOnly } from '../middlewares/auth.js';
import { newOrder } from '../controllers/order.js';

const app=express.Router()

app.post("/new",newOrder)

export default app;