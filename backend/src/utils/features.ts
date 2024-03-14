import mongoose from "mongoose";
import { InvalidateCacheProps } from "../types/types.js";
import { Product } from "../models/product.js";
import { nodeCache } from "../app.js";

export const connectDB=()=>{
    mongoose.connect('mongodb://0.0.0.0:27017',{
        dbName: "SnazzyStore"
    }).then((c)=> console.log(`DB Connected to ${c.connection.host}`)).
    catch((e)=> console.log(e) 
    )
}

export const invalidateCache=async ({product,order,admin}: InvalidateCacheProps)=>{
    if(product){
        const productKeys: string[]=[
            "latest-products",
            "categories",
            "all-products"
        ];
        const products=await Product.find({}).select("_id")

        products.forEach((i)=>{
            productKeys.push(`product-${i._id}`)
        })

        nodeCache.del(productKeys)
    }

    if(order){

    }

    if(admin){

    }
}