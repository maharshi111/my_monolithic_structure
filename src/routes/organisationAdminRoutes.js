const API = require("../utils/apiBuilder");
const AuthController = require("../controllers/organisationAdmin/AuthController");
const EmployeeController = require("../controllers/organisationAdmin/EmployeeController");
const DepartmentController = require("../controllers/organisationAdmin/DepartmentController");
const EmployeeBonusController = require("../controllers/organisationAdmin/EmployeeBonusController");
const AjaxController = require("../controllers/organisationAdmin/AjaxController");
const DashboardController = require("../controllers/organisationAdmin/DashboardController");
const { TableFields } = require("../utils/constants");
const router = API.configRoute("/orgAdmin")

  // Auth routes
  .addPath("/login")
  .asPOST(AuthController.login)
  .build()

  .addPath("/forgotpassword")
  .asPOST(AuthController.forgotPassword)
  .build()

  .addPath("/logout")
  .asPOST(AuthController.logout)
  .useOrganisationAuth()
  .build()

  // Employee routes
  .addPath("/add-employee")
  .asPOST(EmployeeController.addEmployee)
  .useOrganisationAuth()
  .build()

  .addPath("/edit-employee")
  .asPOST(EmployeeController.editEmployee)
  .useOrganisationAuth()
  .build()

  .addPath(`/delete-employee/:${TableFields.ID}`)
  .asPOST(EmployeeController.deleteEmployee)
  .useOrganisationAuth()
  .build()

  //Department routes

  .addPath("/add-department")
  .asPOST(DepartmentController.addDepartment)
  .useOrganisationAuth()
  .build()

  .addPath("/edit-department")
  .asPOST(DepartmentController.editDepartment)
  .useOrganisationAuth()
  .build()

  .addPath(`/delete-department/:${TableFields.ID}`)
  .asPOST(DepartmentController.deleteDepartment)
  .useOrganisationAuth()
  .build()

  // Bonus routes

  .addPath(`/add-bonus/:${TableFields.ID}`)
  .asPOST(EmployeeBonusController.addBonus)
  .useOrganisationAuth()
  .build()

  .addPath(`/update-bonus/:${TableFields.ID}`)
  .asPOST(EmployeeBonusController.updateBonus)
  .useOrganisationAuth()
  .build()
 
  .addPath(`/delete-bonus/:${TableFields.idString}`)
  .asPOST(EmployeeBonusController.deleteBonus)
  .useOrganisationAuth()
  .build()

  // Ajax rutes

  .addPath(`/ajax-ceo`)
  .asPOST(AjaxController.ajaxCeo)
  .useOrganisationAuth()
  .build()

  .addPath(`/ajax-org-name`)
  .asPOST(AjaxController.ajaxOrgName)
  .useOrganisationAuth()
  .build()

  .addPath(`/ajax-org-Id`)
  .asPOST(AjaxController.ajaxOrgId)
  .useOrganisationAuth()
  .build()

  .addPath("/ajax-manager-email")
  .asPOST(AjaxController.ajaxManagerEmail)
  .useOrganisationAuth()
  .build()

  .addPath("/ajax-dep-name")
  .asPOST(AjaxController.ajaxDepName)
  .useOrganisationAuth()
  .build()


// DashBoard routes
  .addPath('/employee-count')
  .asPOST(DashboardController.employeeCount)
  .useOrganisationAuth()
  .build()


  
  .getRouter();

module.exports = router;
