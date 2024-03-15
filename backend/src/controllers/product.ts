import { Request } from "express";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import { Product } from "../models/product.js";
import { BaseQuery, NewProductRequestBody, SearchRequestQuery } from "../types/types.js";
import { rm } from "fs";
import { nodeCache } from "../app.js";
import { off } from "process";
import { invalidateCache } from "../utils/features.js";

export const newProduct = TryCatch(
    async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
      const { name, price, stock, category } = req.body;
      const photo = req.file;
  
      if (!photo) return next(new ErrorHandler("Please add Photo", 400));

      if(!name || !price || !stock || !category){
        rm(photo.path,()=>{
          console.log('Deleted'); 
          
        })
        return next(new ErrorHandler("Please add all fields", 400))
      }
  
  
      await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path,
      });
      
      invalidateCache({product:true,admin:true})
  
      return res.status(201).json({
        success: true,
        message: "Product Created Successfully",
      });
    }
)

//will have to revalidate on New, update or delete product & new order obviously otherwise it will send the cached data only.
export const getLatestProducts = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    
    let products
    if(nodeCache.has("latest-products")){
      products=JSON.parse(nodeCache.get("latest-products") as string)
    }

    else{
      products=await Product.find({}).sort({createdAt: -1}).limit(5)      //-1 means ascending
      nodeCache.set("latest-products",JSON.stringify(products))
    }
    

    return res.json({
      result:products
    })
})

export const getAllCategories = TryCatch(async (req, res, next) => {

  let categories;

  if(nodeCache.has("categories"))
  {
    categories=JSON.parse(nodeCache.get("categories") as string)
  }
  else{
    categories = await Product.distinct("category");
    nodeCache.set("categories",JSON.stringify(categories))
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});

export const getAdminProducts = TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    
    let products;

    if(nodeCache.has("all-products"))
    {
      products=JSON.parse(nodeCache.get("all-products") as string)
    }
  else{
    products = await Product.find({})
    nodeCache.set("all-products",JSON.stringify(products))
  }

    return res.json({
      result:products
    })
})

export const getProductDetail= TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    
    let product;
    const productId=req.params.id
    if(nodeCache.has(`product-${productId}`))
    {
      product=JSON.parse(nodeCache.get(`product-${productId}`) as string)
    }
    else{
      product=await Product.findById(productId)

      if(!product)
      {
        return next(new ErrorHandler("Product Not Found",404))
      }
      nodeCache.set(`product-${productId}`,JSON.stringify(product))
    }

    return res.json({
      result:product
    })
})

export const updateProductDetail= TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    
      const productId=req.params.id
      const { name, price, stock, category } = req.body;
      const photo = req.file;
  
      const product=await Product.findById(productId)

      if(!product){
        return next(new ErrorHandler("Product doesn't exist!",404))
      }
  

      //if photo is given by again, we will delete the old photo right, so that path we can get from the database itself.
      if(photo){
        rm(product.photo,()=>{
          console.log('Old Photo Deleted'); 
        })
        product.photo=photo.path
      }
      
      if(name) product.name=name;
      if(price) product.price=price;
      if(stock) product.stock=stock;
      if(category) product.category=category;
  
      await product.save()
      invalidateCache({product:true,productId:String(product._id),admin:true})
  
      return res.status(200).json({
        success: true,
        message: "Product Updated Successfully",
      });
})

export const deleteProduct= TryCatch(
  async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    
    const productId=req.params.id
    const product=await Product.findById(productId)

    if(!product){
      return next(new ErrorHandler("Product doesn't exist!",404))
    }

    //we also have to ensure that photo also getting deleted from the uploads
    rm(product.photo,()=>{
      console.log('Product Photo deleted!');
    })

    await product.deleteOne()
    invalidateCache({product:true,productId:String(product._id),admin:true})
    return res.status(200).json({
      success:true,
      msg:"Product Deleted Successfully!"
    })
})

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SearchRequestQuery>, res, next) => {
    const { search, sort, category, price } = req.query;

    const page = Number(req.query.page) || 1;
    
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;

    //logic for sorting and showing the products on the pagination, lets say if you are on page 2, then skip=(2-1)*8 = 8 means 8 products will be skipped! 
    const productsPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filteredOnlyProduct] = await Promise.all([
      productsPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);

