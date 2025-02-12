const jwt = require("jsonwebtoken");
const {
  ValidationMsgs,
  TableFields,
  UserTypes,
  InterfaceTypes,
  ResponseStatus,
  JWTConstants,
  AuthTypes,
} = require("../utils/constants");
const Util = require("../utils/util");
const ValidationError = require("../utils/ValidationError");
const SuperAdminService = require("../db/services/SuperAdminServices");
const { header } = require("express-validator");

const superAdminAuth = async (req, res, next) => {
  try {
    const headerToken = req.header("Authorization").replace("Bearer ", "");

    if (!headerToken) {
      throw new ValidationError(ValidationMsgs.HeaderTokenAbsent);
    }
    const decoded = jwt.verify(headerToken, process.env.JWT_ADMIN_PK);
    if (!decoded) {
      throw new ValidationError(ValidationMsgs.DecodedTokenFail);
    }
    const superAdmin = await SuperAdminService.getUserByIdAndToken(
      decoded[TableFields.superAdminId],
      headerToken
    )
      .withBasicInfo()
      .withPassword()
      .execute();

    if (!superAdmin) {
      throw new ValidationError();
    }
    req[TableFields.superAdminId] = superAdmin[TableFields.ID];
    next();
  } catch (e) {
    if (!(e instanceof ValidationError)) {
      console.log(e);
    }
    res
      .status(ResponseStatus.Unauthorized)
      .send(Util.getErrorMessageFromString(ValidationMsgs.AuthFail));
  }
};

module.exports = superAdminAuth;
