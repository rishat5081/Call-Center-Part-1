const multer = require('multer'),
      path = require('path')

      const multerStorage = multer.diskStorage(
        {
            destination : './public/userprofileImage/',
            filename : (req, file, cb)=>
            {
                cb(null,file.fieldname + path.extname(file.originalname))
            }
        })      
        const fileUpload_Specs = multer(
            {
                storage : multerStorage,
                limits : { fileSize : 3000000 },
                fileFilter : (req,file, cb)=>
                {
                    checkFileType(file,cb)
                }
            }).any()
    
    
    function checkFileType(file, cb) {
     
        const types = /jpeg|jpg|png|gif/
        const extnames = types.test(path.extname(file.originalname).toLowerCase())
        const mimetype = types.test(file.mimetype)
        console.log(extnames , mimetype);
        
        if (extnames && mimetype)
            return cb(null, true)
        else
            cb('Wrong File Type')
    }
    
    module.exports = fileUpload_Specs