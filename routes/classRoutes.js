const express = require("express")
const {addClass,getAllClasses} = require("../controllers/classController")


const router = express.Router()

router.route("/addClass").post(addClass)
router.route("/getAllClasses").get(getAllClasses)



module.exports = router