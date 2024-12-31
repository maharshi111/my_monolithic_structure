const API = require("../utils/apiBuilder");
const AuthController = require("../controllers/admin/AuthController");
const DefaultController = require("../controllers/admin/DefaultController");
const CollegeController = require("../controllers/admin/CollegeController");
const {TableFields} = require("../utils/constants");

const router = API.configRoute("/admin")
/**
 * -----------
 * Auth Routes  
 * -----------
 */
.addPath("/signup") 
.asPOST(AuthController.addAdminUser)
.build()

.addPath("/login")
.asPOST(AuthController.login)
.build()

.addPath("/logout")
.asPOST(AuthController.logout)
.useAdminAuth()
.build()

.addPath("/password/forgot")
.asPOST(AuthController.forgotPassword)
.build()

.addPath("/password/reset")
.asPOST(AuthController.resetPassword)
.build()

.addPath("/password/change")
.asUPDATE(AuthController.changePassword)
.useAdminAuth()
.build()
/**
 * ------------
 * CMS
 * -----------
 */
.addPath("/privacy-policy")
.asPOST(DefaultController.editPrivacyPolicy)
.useAdminAuth()
.build()

.addPath("/terms-conditions")
.asPOST(DefaultController.editTermsAndConditions)
.useAdminAuth()
.build()

.addPath("/about-us")
.asPOST(DefaultController.editAboutUs)
.useAdminAuth()
.build()
/**
 * ------------
 * College
 * -----------
 */
.addPath("/college")
.asPOST(CollegeController.addCollege)
.useAdminAuth()
.build()

.addPath("/college/list")
.asGET(CollegeController.listAllCollege)
.useAdminAuth()
.build()

.addPath(`/college-update/:${TableFields.ID}`)
.asUPDATE(CollegeController.updateCollege)
.useAdminAuth()
.build()

.addPath(`/college-delete/:${TableFields.ID}`)
.asDELETE(CollegeController.deleteCollege)
.useAdminAuth()
.build()

.addPath(`/college/:${TableFields.ID}`)
.asGET(CollegeController.getCollegeInfo)
.useAdminAuth()
.build()

.getRouter();

module.exports = router;
