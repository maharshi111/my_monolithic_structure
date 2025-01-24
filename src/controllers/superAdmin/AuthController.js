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
const bcrypt = require("bcryptjs");
var mongoose = require('mongoose');
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
  console.log('==>>',superAdmin [TableFields.password]);
  
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

exports.postAjaxValidation = async(req,res,next) =>{
    let email = req.body[TableFields.email].trim().toLowerCase();
    if (!email) throw new ValidationError(ValidationMsgs.RequiredField);
    let superAdmin = await SuperAdminService.findByEmail(email).withBasicInfo().execute();
    if(!superAdmin){
        throw new ValidationError(ValidationMsgs.SuperAdminNotExists);
    }
   
}

exports.postAjaxPassValidation = async(req,res,next) =>{
    const reqBody = req.body;
    if(!reqBody[TableFields.password].trim()){
        throw new ValidationError(ValidationMsgs.RequiredField);
    }
    if(!reqBody[TableFields.email].trim().toLowerCase()){
        throw new ValidationError(ValidationMsgs.EmailThenPass);
    }
    let superAdmin = await SuperAdminService.findByEmail(reqBody[TableFields.email].trim().toLowerCase()).withBasicInfo().withPassword().execute();
    if(!superAdmin){
        throw new ValidationError(ValidationMsgs.VerifyEmail);
    }
     let pass = reqBody[TableFields.password].trim();
    // console.log('pass=>',pass);
    
    // let hasedPassword  = await bcrypt.hash(pass,8);
    // console.log('first==>',hasedPassword);
    // let second = await bcrypt.hash(pass,8);
    // console.log('second=>>',second);
    
    // let validPassword = await SuperAdminService.findOneSuperAdminByPassWord(hasedPassword).withBasicInfo().execute();
    // console.log("==?",validPassword);
     
    //console.log('-----',await superAdmin.isValidAuth(pass));
    
    if(!await superAdmin.isValidAuth(pass)){
        throw new ValidationError(ValidationMsgs.IncorrectPssword);
    }
    // if(reqBody[TableFields.password].trim() !== superAdmin[TableFields.password]){
    //     throw new ValidationError(ValidationMsgs.PassInvalidForEmail);
    // }
    //return res.json({ success: true});

}

exports.postAjaxAddCeo = async(req,res,next) =>{
    const ceoEmail = req.body[TableFields.ceoEmail].trim().toLowerCase();
    if(!ceoEmail){
        throw new ValidationError(ValidationMsgs.CeoEmailEmpty);
    }
    let org = await SuperAdminService.findOneOrgByEmail(ceoEmail).withOrgCeo().execute();
    if(!org){
        throw new ValidationError(ValidationMsgs.CeoEmalExist);
    }
    
}

exports.postAjaxAddAdmin =  async(req,res,next) =>{
    const adminEmail  = req.body[TableFields.adminEmail].trim().toLowerCase();
    const ceoEmail = req.body[TableFields.email].trim().toLowerCase();
    if(!adminEmail){
        throw new ValidationError(ValidationMsgs.AdminEmailEmpty);
    }
    let emp = await SuperAdminService.findOneEmpByEmail(adminEmail).withEmployeeBasicInfo().execute();
    if(!emp){
        throw new ValidationError(ValidationMsgs.EmployeeEmailExist);
    }
    if(!ceoEmail){
        throw new ValidationError(ValidationMsgs.CeoEmailEmpty);
    }
    const ceoOrg = await SuperAdminService.findOneOrgByEmail(ceoEmail).withOrgCeo().execute();
    if (!ceoOrg) {
      throw new ValidationError(ValidationMsgs.CeoEmailThanAdminEmail);
    } 
    const orgId = new mongoose.Types.ObjectId(emp[TableFields.organisationId]);
    let org = await SuperAdminService.findByIdOrgId(orgId).withOrgCeo().execute();
    if(org[TableFields.orgCEO][TableFields.email]!==ceoEmail){
        throw new ValidationError(ValidationMsgs.EmpOrgMismatch);
    }

}








