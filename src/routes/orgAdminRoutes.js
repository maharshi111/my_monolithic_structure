const API = require("../utils/apiBuilder");
const AuthController = require("../controllers/orgAdmin/AuthController");
const DefaultController = require("../controllers/orgAdmin/DefaultController");
const { TableFields } = require("../utils/constants");
const router = API.configRoute("/orgAdmin")


  .addPath("/login")
  .asPOST(AuthController.postLogin)
  .build()
   
  .addPath('/forgotpassword')
  .asPOST(AuthController.postForgotPassword)
  .build()

  .addPath('/addEmployee')
  .asPOST(DefaultController.postAddEmployee)
  .useOrganisationAuth()
  .build()

  .addPath('/editEmployee')
  .asPOST(DefaultController.postEditEmployee)
  .useOrganisationAuth()
  .build()


  .addPath('/addDepartment')
  .asPOST(DefaultController.postAddDepartment)
  .useOrganisationAuth()
  .build()

  .addPath('/editDepartment')
  .asPOST(DefaultController.postEditDepartment)
  .useOrganisationAuth()
  .build()

  .addPath(`/deleteDepartment/:${TableFields.ID}`)
  .asPOST(DefaultController.postDeleteDepartment)
  .useOrganisationAuth()
  .build()

  .addPath(`/add-bonus/:${TableFields.ID}`)
  .asPOST(DefaultController.postAddBonus)
  .useOrganisationAuth()
  .build()

  .addPath(`/update-bonus/:${TableFields.ID}`)
  .asPOST(DefaultController.postUpdateBonus)
  .useOrganisationAuth()
  .build()

  .addPath(`/delete-bonus/:${TableFields.idString}`)
  .asPOST(DefaultController.postDeleteBonus)
  .useOrganisationAuth()
  .build()

  
  .getRouter();

  module.exports = router;
  