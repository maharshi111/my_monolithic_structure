const API = require("../utils/apiBuilder");
const AuthController = require("../controllers/superAdmin/AuthController");
const OrganisationAdminController = require("../controllers/superAdmin/OrganisationAdminController.js");
const OrganisationController = require("../controllers/superAdmin/OrganisationController.js");
const AjaxController = require("../controllers/superAdmin/AjaxController.js");
const DahboardController = require('../controllers/superAdmin/DashboardController.js');
const { TableFields } = require("../utils/constants");
const router = API.configRoute("/superAdmin")

  // Auth routes

  .addPath("/signup")
  .asPOST(AuthController.signUp)
  .build()

  .addPath("/login")
  .asPOST(AuthController.login)
  .build()

  .addPath("/forgotpassword")
  .asPOST(AuthController.forgotPassword)
  .build()

  .addPath("/logout")
  .asPOST(AuthController.logout)
  .useSuperAdminAuth()
  .build()
  //   Organisation routes

  .addPath("/add-organisation")
  .asPOST(OrganisationController.addOrganisation)
  .useSuperAdminAuth()
  .build()

  .addPath("/edit-organisation")
  .asPOST(OrganisationController.editOrganisation)
  .useSuperAdminAuth()
  .build()

  .addPath(`/delete-organisation/:${TableFields.ID}`)
  .asPOST(OrganisationController.deleteOrganisation)
  .useSuperAdminAuth()
  .build()

  // Organisation Admin routes

  .addPath("/add-edit-admin")
  .asPOST(OrganisationAdminController.addEditAdmin)
  .useSuperAdminAuth()
  .build()

  // Ajax routes

  .addPath("/ajax-validation")
  .asPOST(AjaxController.ajaxValidation)
  .useSuperAdminAuth()
  .build()

  .addPath("/ajax-pass-validation")
  .asPOST(AjaxController.ajaxPassValidation)
  .useSuperAdminAuth()
  .build()

  .addPath("/ajax-org-ceo")
  .asPOST(AjaxController.ajaxAddCeo)
  .useSuperAdminAuth()
  .build()

  .addPath("/ajax-admin-validation")
  .asPOST(AjaxController.ajaxAddAdmin)
  .useSuperAdminAuth()
  .build()

  // superadmin dashboard routes

  .addPath('/dashboard')
  .asPOST(DahboardController.superAdminDashboard)
  .useSuperAdminAuth()
  .build()

  .getRouter();

module.exports = router;
