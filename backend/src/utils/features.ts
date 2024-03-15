import mongoose from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { Product } from "../models/product.js";
import { nodeCache } from "../app.js"; 
import { Order } from "../models/order.js";
export const connectDB=(uri:string)=>{
    mongoose.connect(uri,{
        dbName: "SnazzyStore"
    }).then((c)=> console.log(`DB Connected to ${c.connection.host}`)).
    catch((e)=> console.log(e) 
    )
}

export const invalidateCache=async ({product,order,admin,userId,orderId,productId}: InvalidateCacheProps)=>{
    if(product){
        const productKeys: string[]=[
            "latest-products",
            "categories",
            "all-products",
        ];

        if(typeof productId==="string")
        {
            productKeys.push(`product-${productId}`)
        }
        if(typeof productId==="object")
        {
            productId.forEach((i)=> productKeys.push(`product-${i}`))
        }

        nodeCache.del(productKeys)
    }

    if(order){
        const ordersKeys: string[] = [
            "all-orders",
            `my-orders-${userId}`,
            `order-${orderId}`
          ];
      
          nodeCache.del(ordersKeys);
    }

    if(admin){

    }
}

export const reduceStock = async (orderItems: OrderItemType[]) => {
    for (let i = 0; i < orderItems.length; i++) {
      const order = orderItems[i];
      const product = await Product.findById(order.productId);
      if (!product) throw new Error("Product Not Found");
      product.stock -= order.quantity;
      await product.save();
    }
  };