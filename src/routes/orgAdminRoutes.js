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

  .addPath('/addDepartment')
  .asPOST(DefaultController.postAddDepartment)
  .useOrganisationAuth()
  .build()


  
  .getRouter();

  module.exports = router;
  