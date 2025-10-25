//  const multer = require("multer")

//  const storage = multer.diskStorage({
//     filename: function(req,file,cd){
//         concatBytes(null,file.originalname)
//     }
//  })

//  const upload = multer({storage:storage})

//  module.exports = upload ;
const multer = require("multer");

const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // folder to store uploaded files
//   },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // unique file name
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
