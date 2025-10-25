const express = require("express")
const router = express.Router()
const cloudinary = require("../utils/cloudinary")
const upload    = require("../middleware/multer")
const fs = require("fs");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
// router.post('/upload', upload.single('image'), function (req,res) {
//     cloudinary.uploader.upload(req.file.path,function (err, result){
//         if(err) {
//             console.log(err)
//             return res.status(500).json({
//                 success:false,
//                 message:"Error"
//             })
//         }

//         res.status(200).json({
//             success:true,
//             message:"upload",
//             data:result
//         })
//     })
// })





// ✅ Upload route
router.post("/upload", upload.single("image"), async (req, res) => {
    console.error("Cloudinary upload error:1");
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    
    const fileBuffer = fs.readFileSync(req.file.path);
    const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
    // Delete file from local after uploading to Cloudinary
    // fs.unlinkSync(req.file.path);
    let contractid = uuidv4();
    
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: result,
      hash: hash
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: err.message,
    });
  }
});

module.exports = router;

 