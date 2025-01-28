const {
  TableFields,
  ValidationMsgs,
  InterfaceTypes,
} = require("../../utils/constants");
const ValidationError = require("../../utils/ValidationError");
const SuperAdminService = require("../../db/services/SuperAdminServices");
const OrganisationService = require("../../db/services/OrganisationService");
const EmployeeService = require("../../db/services/EmployeeService");
const emailUtil = require("../../utils/email");
const Util = require("../../utils/util");
var mongoose = require("mongoose");
exports.postAjaxValidation = async (req, res, next) => {
  let email = req.body[TableFields.email].trim().toLowerCase();
  if (!email) throw new ValidationError(ValidationMsgs.RequiredField);
  let superAdmin = await SuperAdminService.findByEmail(email)
    .withBasicInfo()
    .execute();
  if (!superAdmin) {
    throw new ValidationError(ValidationMsgs.SuperAdminNotExists);
  }
};

exports.postAjaxPassValidation = async (req, res, next) => {
  const reqBody = req.body;
  if (!reqBody[TableFields.password].trim()) {
    throw new ValidationError(ValidationMsgs.RequiredField);
  }
  if (!reqBody[TableFields.email].trim().toLowerCase()) {
    throw new ValidationError(ValidationMsgs.EmailThenPass);
  }
  let superAdmin = await SuperAdminService.findByEmail(
    reqBody[TableFields.email].trim().toLowerCase()
  )
    .withBasicInfo()
    .withPassword()
    .execute();
  if (!superAdmin) {
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

  if (!(await superAdmin.isValidAuth(pass))) {
    throw new ValidationError(ValidationMsgs.IncorrectPssword);
  }
  // if(reqBody[TableFields.password].trim() !== superAdmin[TableFields.password]){
  //     throw new ValidationError(ValidationMsgs.PassInvalidForEmail);
  // }
  //return res.json({ success: true});
};

exports.postAjaxAddCeo = async (req, res, next) => {
  const ceoEmail = req.body[TableFields.ceoEmail].trim().toLowerCase();
  if (!ceoEmail) {
    throw new ValidationError(ValidationMsgs.CeoEmailEmpty);
  }
  let org = await OrganisationService.findOneOrgByEmail(ceoEmail)
    .withOrgCeo()
    .execute();
  if (!org) {
    throw new ValidationError(ValidationMsgs.CeoEmalExist);
  }
};

exports.postAjaxAddAdmin = async (req, res, next) => {
  const adminEmail = req.body[TableFields.adminEmail].trim().toLowerCase(); //PERSONAL EMAIL
  const ceoEmail = req.body[TableFields.email].trim().toLowerCase();
  if (!adminEmail) {
    throw new ValidationError(ValidationMsgs.AdminEmailEmpty);
  }
  let emp = await EmployeeService.findOneEmpByEmail(adminEmail)
    .withEmployeeBasicInfo()
    .execute();
  if (!emp) {
    throw new ValidationError(ValidationMsgs.EmployeeEmailExist);
  }
  if (!ceoEmail) {
    throw new ValidationError(ValidationMsgs.CeoEmailEmpty);
  }
  const ceoOrg = await OrganisationService.findOneOrgByEmail(ceoEmail)
    .withOrgCeo()
    .execute();
  if (!ceoOrg) {
    throw new ValidationError(ValidationMsgs.CeoEmailThanAdminEmail);
  }
  const orgId = new mongoose.Types.ObjectId(emp[TableFields.organisationId]);
  let org = await OrganisationService.findByIdOrgId(orgId)
    .withOrgCeo()
    .execute();
  if (org[TableFields.orgCEO][TableFields.email] !== ceoEmail) {
    throw new ValidationError(ValidationMsgs.EmpOrgMismatch);
  }
};
