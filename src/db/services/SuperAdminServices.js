const {
  TableFields,
  ValidationMsgs,
  UserTypes,
  TableNames,
} = require("../../utils/constants");
const Util = require("../../utils/util");
const ValidationError = require("../../utils/ValidationError");
const SuperAdmin = require("../models/superAdmin");

class SuperAdminService {
  static saveSuperAdmim = async (recordzobj) => {
    console.log("error", recordzobj);
    const superAdmin = new SuperAdmin(recordzobj);
    if (!Util.isEmail(superAdmin[TableFields.email])) {
      throw new ValidationError(ValidationMsgs.EmailInvalid);
    }
    if (!superAdmin.isValidPassword(superAdmin[TableFields.password])) {
      throw new ValidationError(ValidationMsgs.PasswordInvalid);
    }

    const error = superAdmin.validateSync();
    if (error) throw error;
    await superAdmin.save();
  };

  static findByEmail = async (email) => {
    return await SuperAdmin.findOne({ [TableFields.email]: email });
  };
}

module.exports = SuperAdminService;
