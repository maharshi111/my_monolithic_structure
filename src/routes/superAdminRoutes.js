const API = require("../utils/apiBuilder");
const AuthController = require("../controllers/superAdmin/AuthController");
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

  .getRouter();

module.exports = router;
