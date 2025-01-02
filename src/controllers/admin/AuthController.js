const AdminService = require("../../db/services/AdminService");
const {
  InterfaceTypes,
  TableFields,
  ValidationMsgs,
} = require("../../utils/constants");
const Util = require("../../utils/util");
const Email = require("../../utils/email");
const ValidationError = require("../../utils/ValidationError");

exports.addAdminUser = async (req) => {
  if (Util.parseBoolean(req.headers.dbuser)) {
    await AdminService.insertUserRecord(req.body);

    let email = req.body[TableFields.email];
    email = (email + "").trim().toLowerCase();
    let user = await AdminService.findByEmail(email)
      .withPassword()
      .withUserType()
      .withBasicInfo()
      .execute();

    const token = user.createAuthToken(InterfaceTypes.Admin.AdminWeb); //InterfaceType: Static for now [But we will take this in API REQ later, during application development (if required)]
    await AdminService.saveAuthToken(user[TableFields.ID], token);

    return { user, token };
  } else throw new ValidationError("Not-allowed");
};

exports.login = async (req) => {
  let email = req.body[TableFields.email];
  if (!email) throw new ValidationError(ValidationMsgs.EmailEmpty);
  email = (email + "").trim().toLowerCase();

  const password = req.body[TableFields.password];
  if (!password) throw new ValidationError(ValidationMsgs.PasswordEmpty);

  let user = await AdminService.findByEmail(email)
    .withPassword()
    .withUserType()
    .withBasicInfo()
    .execute();
  if (user && (await user.isValidAuth(password)) && user[TableFields.active]) {
    const token = user.createAuthToken(InterfaceTypes.Admin.AdminWeb);
    await AdminService.saveAuthToken(user[TableFields.ID], token);
    return { user, token };
  } else throw new ValidationError(ValidationMsgs.UnableToLogin);
};

exports.logout = async (req) => {
  const headerToken = req.header("Authorization").replace("Bearer ", "");
  AdminService.removeAuth(req.user[TableFields.ID], headerToken);
};

exports.forgotPassword = async (req) => {
  let providedEmail = req.body[TableFields.email];
  providedEmail = (providedEmail + "").trim().toLowerCase();

  if (!providedEmail) throw new ValidationError(ValidationMsgs.EmailEmpty);

  let { code, name, email } = await AdminService.getResetPasswordToken(
    providedEmail
  );
  // Email.SendForgotPasswordEmail(name, email, code);
};

exports.resetPassword = async (req) => {
  let providedEmail = req.body[TableFields.email];
  providedEmail = (providedEmail + "").trim().toLowerCase();

  const { code, newPassword } = req.body;

  if (!providedEmail) throw new ValidationError(ValidationMsgs.EmailEmpty);
  if (!code) throw new ValidationError(ValidationMsgs.PassResetCodeEmpty);
  if (!newPassword) throw new ValidationError(ValidationMsgs.NewPasswordEmpty);

  let user = await AdminService.resetPassword(providedEmail, code, newPassword);
  let token = await createAndStoreAuthToken(user);
  return {
    user: await AdminService.getUserById(user[TableFields.ID])
      .withPassword()
      .withUserType()
      .withBasicInfo()
      .execute(),
    token: token || undefined,
  };
};

exports.changePassword = async (req) => {
  let { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    throw new ValidationError(ValidationMsgs.ParametersError);

  let user = await AdminService.getUserById(req.user[TableFields.ID])
    .withPassword()
    .withId()
    .execute();

  if (user && (await user.isValidAuth(oldPassword))) {
    if (!user.isValidPassword(newPassword))
      throw new ValidationError(ValidationMsgs.PasswordInvalid);
    const token = user.createAuthToken();
    await AdminService.updatePasswordAndInsertLatestToken(
      user,
      newPassword,
      token
    );
    return {};
  } else throw new ValidationError(ValidationMsgs.OldPasswordIncorrect);
};

exports.addEmp = async(req,res) => {
    const data = req.body
    await AdminService.addEmp(data)
    Email.sendMail(email)
};

async function createAndStoreAuthToken(userObj) {
  const token = userObj.createAuthToken(InterfaceTypes.Admin.AdminWeb);
  await AdminService.saveAuthToken(userObj[TableFields.ID], token);
  return token;
}
