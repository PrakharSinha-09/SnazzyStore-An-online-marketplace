import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js";
import ErrorHandler from "../utils/utility-class.js";

export const newCoupon=TryCatch(async(req,res,next)=>{
    const {coupon,amount}=req.body

    if(!coupon || !amount)
    {
        return next(new ErrorHandler("Enter All Fields",400))
    }
    await Coupon.create({
        code:coupon,
        amount:amount
    })

    return res.status(201).json({
        success:true,
        msg:"Coupon Created Successfully!"
    })
})

export const applyDiscount=TryCatch(async(req,res,next)=>{
    const {coupon}=req.query

    const couponExists=await Coupon.findOne({code:coupon})
    if(!couponExists)
    {
        return next(new ErrorHandler("Invalid Coupon Code",400))
    }

    return res.status(200).json({
        success:true,
        discount:couponExists.amount
    })
})

export const allCoupons=TryCatch(async(req,res,next)=>{

    const coupons=await Coupon.find({})
    if(!coupons)
    {
        return next(new ErrorHandler("Invalid Coupon Code",400))
    }

    return res.status(200).json({
        success:true,
        coupons
    })
})

export const deleteCoupon=TryCatch(async(req,res,next)=>{

    const {id}=req.params
    const coupon=await Coupon.findByIdAndDelete(id)

    // await Coupon.deleteOne({code:coupon})
    return res.status(200).json({
        success:true,
        msg:"Coupon Deleted Successfully"
    })
})
