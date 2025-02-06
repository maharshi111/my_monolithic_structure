const {
  TableFields,
  ValidationMsgs,
  InterfaceTypes,
} = require("../../utils/constants");
const ValidationError = require("../../utils/ValidationError");

const emailUtil = require("../../utils/email");
const Util = require("../../utils/util");
const OrganisationService = require("../../db/services/OrganisationService");
const organisationSchema = require("../../db/models/organisation");
const { MongoUtil } = require("../../db/mongoose");
var mongoose = require("mongoose");

exports.login = async (req, res, next) => {
  const reqBody = req.body;

  if (!reqBody[TableFields.email]) {
    throw new ValidationError(ValidationMsgs.EmailEmpty);
  }

  let org = await OrganisationService.findOneOrgByEmail(
    reqBody[TableFields.email].trim().toLowerCase()
  )
    .withBasicInfoOrg()
    .execute();

  if (!org) {
    throw new ValidationError(ValidationMsgs.CeoEmalExist);
  }

  if (!reqBody[TableFields.companyName]) {
    throw new ValidationError(ValidationMsgs.companyNameExist);
  }

  org = await OrganisationService.findOneByOrgName(
    reqBody[TableFields.companyName].trim().toUpperCase()
  )
    .withBasicInfoOrg()
    .execute();

  if (!org) {
    throw new ValidationError(ValidationMsgs.InvalidCompanyName);
  }

  if (!reqBody[TableFields.orgId]) {
    throw new ValidationError(ValidationMsgs.OrgIdEmpty);
  }

  let companyNameArr = await OrganisationService.findOrgByEmail(
    reqBody[TableFields.email].trim().toLowerCase()
  )
    .withUniqueId()
    .execute();

  if (companyNameArr.length === 0) {
    throw new ValidationError(ValidationMsgs.CeoEmalExist);
  }

  //let count = false;

  //   for (let companyName of companyNameArr) {
  //     if (
  //       companyName[TableFields.uniqueId].toString() ===
  //       reqBody[TableFields.orgId].trim()
  //     ) {
  //       count = true;
  //       console.log("true statement");
  //     }
  //   }
  const exists = companyNameArr.some((companyName) => {
    
    return  companyName[TableFields.uniqueId].toString() ===
      reqBody[TableFields.orgId].trim()
    
  });

//   if (count === false) {
//     throw new ValidationError(ValidationMsgs.InvalidOrgId);
//   }
if(!exists){
    throw new ValidationError(ValidationMsgs.InvalidOrgId); 
}
 else {
    let orgObject = await OrganisationService.findOrgByUniqueId(
      reqBody[TableFields.orgId].trim()
    )
      .withTokenInfo()
      .execute();
    console.log("this is orgObject", orgObject);

    if (
      orgObject[TableFields.orgName] !==
      reqBody[TableFields.companyName].trim().toUpperCase()
    ) {
      throw new ValidationError(ValidationMsgs.IncorrectCompanyName);
    }

    const token = orgObject.createAuthToken(orgObject);
    await OrganisationService.saveAuthToken(
      reqBody[TableFields.orgId].trim(),
      token
    );
    return { orgObject, token };
  }
};

exports.forgotPassword = async (req, res) => {
  if (!req.body[TableFields.email])
    throw new ValidationError(ValidationMsgs.EmailEmpty);

  const receiverEmail = req.body[TableFields.email].trim().toLowerCase();

  if (
    !(await OrganisationService.findOneOrgByEmail(receiverEmail)
      .withBasicInfoOrg()
      .execute())
  ) {
    throw new ValidationError(ValidationMsgs.EmailRecordNotExists);
  }
  emailUtil.SendForgotPasswordEmailOrg(receiverEmail);
};

exports.logout = async (req) => {
  const headerToken = req.header("Authorization").replace("Bearer ", "");
  OrganisationService.removeAuth(req.orgId, headerToken);
};
