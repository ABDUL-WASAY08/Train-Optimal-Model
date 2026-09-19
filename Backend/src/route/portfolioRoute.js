const  express=require("express");

const {GetPublicPortfolio,GetportfolioUrl}= require("../controller/getPublicPortfolioByUsername")
const router=express.Router();
router.get("/getprofile",GetportfolioUrl );
router.get("/portfolio/:username", GetPublicPortfolio);
module.exports= router