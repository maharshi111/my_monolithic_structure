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

  .addPath(`/deleteOrganisation/:${TableFields.ID}`)
  .asPOST(DefaultController.postDeleteOrganisation)
  .useSuperAdminAuth()
  .build()

  .addPath('/addEditAdmin')
  .asPOST(DefaultController.postAddEditAdmin)
  .useSuperAdminAuth()
  .build()

  .addPath('/ajax-validation')
  .asPOST(AuthController.postAjaxValidation)
  .useSuperAdminAuth()
  .build()

  .addPath('/ajax-pass-validation')
  .asPOST(AuthController.postAjaxPassValidation)
  .useSuperAdminAuth()
  .build()

  .addPath('/ajax-org-ceo')
  .asPOST(AuthController.postAjaxAddCeo)
  .useSuperAdminAuth()
  .build()

  .addPath('/ajax-admin-validation')
  .asPOST(AuthController.postAjaxAddAdmin)
  .useSuperAdminAuth()
  .build()

 

  .getRouter();

module.exports = router;
