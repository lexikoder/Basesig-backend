const express = require("express")
const router = express.Router()
const upload    = require("../middleware/multer");
const {  Uploaddoc ,signcontract,
applyforearlypayment,
contractfinancing,
makepayment,
getalldocs,
getallactivities,
getallrecipientstatuspending,
getallrecipientstatuscompleted,
getallcompletedusercontract,
getallcompletedusercontractforfinancing,
getallpendingfinancedcontract,
getallcompletedfinancedcontract,
makepaymentforcontract,
getcontractdetails} = require("../controller/contract-controller");

const authMiddleware = require("../middleware/authentication-middleware")

router.post("/uploaddoc",authMiddleware,upload.single("file"),Uploaddoc);
router.post("/signcontract",authMiddleware,signcontract);
router.post("/applyforearlypayment",authMiddleware,applyforearlypayment);
router.post("/contractfinancing",authMiddleware,contractfinancing);
router.post("/makepayment",authMiddleware,makepayment);
router.get("/getalldocs",authMiddleware,getalldocs);
router.get("/getallactivities",authMiddleware,getallactivities);
router.get("/getallrecipientstatuspending",authMiddleware,getallrecipientstatuspending);
router.get("/getallcompletedusercontract",authMiddleware,getallcompletedusercontract);
router.get("/getallrecipientstatuscompleted",authMiddleware,getallrecipientstatuscompleted);
router.get("/getallcompletedusercontractforfinancing",authMiddleware,getallcompletedusercontractforfinancing);
router.get("/getallpendingfinancedcontract",authMiddleware,getallpendingfinancedcontract);
router.get("/getallcompletedfinancedcontract",authMiddleware,getallcompletedfinancedcontract);
router.get("/makepaymentforcontract",authMiddleware,makepaymentforcontract);
router.get("/getcontractdetails/:contractid",authMiddleware,getcontractdetails);
 
   
module.exports = router  