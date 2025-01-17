const {
  TableFields,
  ValidationMsgs,
  InterfaceTypes,
} = require("../../utils/constants");
const ValidationError = require("../../utils/ValidationError");
const SuperAdminService = require("../../db/services/SuperAdminServices");
const emailUtil = require("../../utils/email");
const superAdminSchema = require("../../db/models/superAdmin");
const Util = require("../../utils/util");
exports.postSignUp = async (req, res, next) => {
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
  if (userName.length > 70) {
    throw new ValidationError(ValidationMsgs.UserNameLength);
  }
  if (email.length > 30) {
    throw new ValidationError(ValidationMsgs.EmailLength);
  }
  if (password.length < 5 || password.length > 15) {
    throw new ValidationError(ValidationMsgs.PasswordLength);
  }

  const superAdmin = {
    [TableFields.name_]: userName,
    [TableFields.email]: email,
    [TableFields.password]: password,
  };
  await SuperAdminService.saveSuperAdmim(superAdmin);
};

exports.postLogin = async (req, res, next) => {
  let email = req.body[TableFields.email];
  if (!email) throw new ValidationError(ValidationMsgs.EmailEmpty);
  const password = req.body[TableFields.password];
  //console.log('inside post',password);
  
  if (!password) throw new ValidationError(ValidationMsgs.PasswordEmpty);
  let superAdmin = await SuperAdminService.findByEmail(email).withBasicInfo().withPassword().execute();
  console.log('this is superAdmin',superAdmin);
  console.log(typeof(superAdmin));
  
  if (superAdmin && await superAdmin.isValidAuth(password)) {
    //console.log('this is return value',superAdmin.isValidAuth(password)); 
    
    const token = superAdmin.createAuthToken(superAdmin);
    console.log('this is token:',token);
    
    await SuperAdminService.saveAuthToken(superAdmin[TableFields.ID], token);
    
    // res.cookie("uid", token);
    //res.redirect("/superAdmin/getAllOrganisation");
    return { superAdmin, token };
    
  }
  else throw new ValidationError(ValidationMsgs.UnableToLogin);
};

exports.postForgotPassword = async (req, res) => {
  const receiverEmail = req.body[TableFields.email];
  if (!receiverEmail) throw new ValidationError(ValidationMsgs.EmailEmpty);
  if(Util.isEmail(receiverEmail)){
    throw new ValidationError(ValidationMsgs.EmailInvalid);
  }
  if(receiverEmail.length > 30){
    throw new ValidationError(ValidationMsgs.EmailLength);
  }
  emailUtil.SendForgotPasswordEmail(receiverEmail);
};

