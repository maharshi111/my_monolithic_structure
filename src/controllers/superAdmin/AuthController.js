const {
  TableFields,
  ValidationMsgs,
  InterfaceTypes,
} = require("../../utils/constants");
const ValidationError = require("../../utils/ValidationError");
const SuperAdminService = require("../../db/services/SuperAdminServices");
const emailUtil = require("../../utils/email");
const Util = require("../../utils/util");
exports.postSignUp = async (req, res, next) => {
  console.log("==>", req.body);

  const userName = req.body.userName;
  const email = req.body.email;
  const password = req.body.password;
  //Add validations

  if (!userName) {
    throw new ValidationError(ValidationMsgs.UserNameEmpty);
  }

  if (!email) {
    throw new ValidationError(ValidationMsgs.EmailEmpty);
  }

  if (!password) {
    throw new ValidationError(ValidationMsgs.PasswordEmpty);
  }

  if (await SuperAdminService.findByEmail(email).withBasicInfo().execute()) {
    throw new ValidationError(ValidationMsgs.EmailRecordAlreadyExists);
  }

  const superAdmin = {
    [TableFields.name_]: userName,
    [TableFields.email]: email,
    [TableFields.password]: password,
  };
  console.log("==>>", superAdmin[TableFields.password]);

  await SuperAdminService.saveSuperAdmim(superAdmin);
};

exports.postLogin = async (req, res, next) => {
  let email = req.body[TableFields.email];

  if (!email) throw new ValidationError(ValidationMsgs.EmailEmpty);
  const password = req.body[TableFields.password];

  if (!password) throw new ValidationError(ValidationMsgs.PasswordEmpty);

  let superAdmin = await SuperAdminService.findByEmail(email)
    .withBasicInfo()
    .withPassword()
    .execute();
  console.log("this is superAdmin", superAdmin);
  console.log(typeof superAdmin);

  if (superAdmin && (await superAdmin.isValidAuth(password))) {
    const token = superAdmin.createAuthToken(superAdmin);
    await SuperAdminService.saveAuthToken(superAdmin[TableFields.ID], token);
    return { superAdmin, token };
  } else throw new ValidationError(ValidationMsgs.UnableToLogin);
};

exports.postForgotPassword = async (req, res) => {
  const receiverEmail = req.body[TableFields.email].trim().toLowerCase();

  if (!receiverEmail) throw new ValidationError(ValidationMsgs.EmailEmpty);

  await emailUtil.SendForgotPasswordEmail(receiverEmail);
};
