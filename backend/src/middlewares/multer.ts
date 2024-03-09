import multer from 'multer'

const storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, "uploads");
    },
    filename(req, file, callback) {
      callback(null, file.originalname);
    },
  });
  
  export const singleUpload = multer({ storage }).single("photo");

  //with line no. 12, we can access this photo via req.file.photo