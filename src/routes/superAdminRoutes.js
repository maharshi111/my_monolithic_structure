const API = require("../utils/apiBuilder");
const AuthController = require("../controllers/superAdmin/AuthController");
const DefaultController = require("../controllers/superAdmin/DefaultController");
const { TableFields } = require("../utils/constants");
const router = API.configRoute("/superAdmin")

  .addPath("/signup")
  .asPOST(AuthController.postSignUp)
  .build()

  .addPath("/login")
  .asPOST(AuthController.postLogin)
  .build()

  .addPath("/forgotPassword")
  .asPOST(AuthController.postForgotPassword)
  .build()

  .addPath("/addOrganisation")
  .asPOST(DefaultController.postAddOrganisation)
  .useSuperAdminAuth()
  .build()


  .addPath('/editOrganisation')
  .asPOST(DefaultController.postEditOrganisation)
  .useSuperAdminAuth()
  .build()


  .addPath('/addAdmin')
  .asPOST(DefaultController.postAddAdmin)
  .useSuperAdminAuth()
  .build()
  
  .getRouter();

module.exports = router;
