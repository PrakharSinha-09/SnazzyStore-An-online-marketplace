import { TryCatch } from "../middlewares/error.js";

export const newOrder=TryCatch(async (req: Request<{}, {}, NewProductRequestBody>, res, next) => {
    
})