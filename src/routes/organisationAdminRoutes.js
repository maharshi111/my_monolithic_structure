const API = require("../utils/apiBuilder");
const AuthController = require("../controllers/organisationAdmin/AuthController");
const EmployeeController = require("../controllers/organisationAdmin/EmployeeController");
const DepartmentController =require('../controllers/organisationAdmin/DepartmentController')
const EmployeeBonusController = require('../controllers/organisationAdmin/EmployeeBonusController');
const AjaxController = require('../controllers/organisationAdmin/AjaxController');
const { TableFields } = require("../utils/constants");
const router = API.configRoute("/orgAdmin")

// Auth routes
  .addPath("/login")
  .asPOST(AuthController.postLogin)
  .build()
   
  .addPath('/forgotpassword')
  .asPOST(AuthController.postForgotPassword)
  .build()

// Employee routes
  .addPath('/addEmployee')
  .asPOST(EmployeeController.postAddEmployee)
  .useOrganisationAuth()
  .build()

  .addPath('/editEmployee')
  .asPOST(EmployeeController.postEditEmployee)
  .useOrganisationAuth()
  .build()

  .addPath(`/deleteEmployee/:${TableFields.ID}`)
  .asPOST(EmployeeController.postDeleteEmployee)
  .useOrganisationAuth()
  .build()

//Department routes

  .addPath('/addDepartment')
  .asPOST(DepartmentController.postAddDepartment)
  .useOrganisationAuth()
  .build()

  .addPath('/editDepartment')
  .asPOST(DepartmentController.postEditDepartment)
  .useOrganisationAuth()
  .build()

  .addPath(`/deleteDepartment/:${TableFields.ID}`)
  .asPOST(DepartmentController.postDeleteDepartment)
  .useOrganisationAuth()
  .build()

// Bonus routes

  .addPath(`/add-bonus/:${TableFields.ID}`)
  .asPOST(EmployeeBonusController.postAddBonus)
  .useOrganisationAuth()
  .build()

  .addPath(`/update-bonus/:${TableFields.ID}`)
  .asPOST(EmployeeBonusController.postUpdateBonus)
  .useOrganisationAuth()
  .build()

  .addPath(`/delete-bonus/:${TableFields.idString}`)
  .asPOST(EmployeeBonusController.postDeleteBonus)
  .useOrganisationAuth()
  .build()

// Ajax rutes

  .addPath(`/ajax-ceo`)
  .asPOST(AjaxController.postAjaxCeo)
  .useOrganisationAuth()
  .build()
   
  .addPath(`/ajax-org-name`)
  .asPOST(AjaxController.postAjaxOrgName)
  .useOrganisationAuth()
  .build()

  .addPath(`/ajax-org-Id`)
  .asPOST(AjaxController.postAjaxOrgId)
  .useOrganisationAuth()
  .build()

  .addPath('/ajax-manager-email')
  .asPOST(AjaxController.postAjaxManagerEmail)
  .useOrganisationAuth()
  .build()

  .addPath('/ajax-dep-name')
  .asPOST(AjaxController.postAjaxDepName)
  .useOrganisationAuth()
  .build()

  
  .getRouter();

  module.exports = router;
  