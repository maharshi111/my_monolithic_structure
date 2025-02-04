const API = require("../utils/apiBuilder");
const AuthController = require("../controllers/superAdmin/AuthController");
const OrganisationAdminController = require("../controllers/superAdmin/OrganisationAdminController.js");
const OrganisationController = require("../controllers/superAdmin/OrganisationController.js");
const AjaxController = require("../controllers/superAdmin/AjaxController.js");
const { TableFields } = require("../utils/constants");
const router = API.configRoute("/superAdmin")

  // Auth routes

  .addPath("/signup")
  .asPOST(AuthController.postSignUp)
  .build()

  .addPath("/login")
  .asPOST(AuthController.postLogin)
  .build()

  .addPath("/forgotpassword")
  .asPOST(AuthController.postForgotPassword)
  .build()

  //   Organisation routes

  .addPath("/add-organisation")
  .asPOST(OrganisationController.postAddOrganisation)
  .useSuperAdminAuth()
  .build()

  .addPath("/edit-organisation")
  .asPOST(OrganisationController.postEditOrganisation)
  .useSuperAdminAuth()
  .build()

  .addPath(`/delete-organisation/:${TableFields.ID}`)
  .asPOST(OrganisationController.postDeleteOrganisation)
  .useSuperAdminAuth()
  .build()

  // Organisation Admin routes

  .addPath("/add-edit-admin")
  .asPOST(OrganisationAdminController.postAddEditAdmin)
  .useSuperAdminAuth()
  .build()

  // Ajax routes

  .addPath("/ajax-validation")
  .asPOST(AjaxController.postAjaxValidation)
  .useSuperAdminAuth()
  .build()

  .addPath("/ajax-pass-validation")
  .asPOST(AjaxController.postAjaxPassValidation)
  .useSuperAdminAuth()
  .build()

  .addPath("/ajax-org-ceo")
  .asPOST(AjaxController.postAjaxAddCeo)
  .useSuperAdminAuth()
  .build()

  .addPath("/ajax-admin-validation")
  .asPOST(AjaxController.postAjaxAddAdmin)
  .useSuperAdminAuth()
  .build()

  .getRouter();

module.exports = router;
