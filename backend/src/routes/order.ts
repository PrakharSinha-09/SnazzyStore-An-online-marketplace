import express from 'express'
import { deleteUser, getAllUsers, getUser, newUser } from '../controllers/user.js';
import { adminOnly } from '../middlewares/auth.js';
import { allOrders, deleteOrder, getSingleOrder, myOrders, newOrder, processOrder } from '../controllers/order.js';

const app=express.Router()

app.post("/new",newOrder)

app.get("/my-orders",myOrders)

app.get("/all",adminOnly,allOrders)

app
  .route("/:id")
  .get(getSingleOrder)
  .put(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);

export default app;