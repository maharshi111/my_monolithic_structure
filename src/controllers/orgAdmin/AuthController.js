const {
    TableFields,
    ValidationMsgs,
    InterfaceTypes,
  } = require("../../utils/constants");
const ValidationError = require("../../utils/ValidationError");

const emailUtil = require("../../utils/email");
const Util = require("../../utils/util");
const OrganisationAdminService = require("../../db/services/orgAdminService");
const organisationSchema = require('../../db/models/organisation');
exports.postLogin = async(req,res,next) =>{
    const reqBody = req.body;
    // console.log('======:',reqBody);
    if(!reqBody[TableFields.email]){
        throw new ValidationError(ValidationMsgs.EmailEmpty);
    }
    if(!Util.isEmail(reqBody[TableFields.email])){
        throw new ValidationError(ValidationMsgs.EmailInvalid);
    }
    let org = await OrganisationAdminService.findOneOrgByEmail(reqBody[TableFields.email]).withBasicInfoOrg().execute();
    if(!org){
        throw new ValidationError(ValidationMsgs.CeoEmalExist);
    }
    if(!reqBody[TableFields.companyName]){
        throw new ValidationError(ValidationMsgs.companyNameExist);
    }
    org = await OrganisationAdminService.findOneByOrgName(reqBody[TableFields.companyName]).withBasicInfoOrg().execute();
    if(!org){
        throw new ValidationError(ValidationMsgs.InvalidCompanyName); 
    }
    if(!reqBody[TableFields.orgId]){
        throw new ValidationError(ValidationMsgs.OrgIdEmpty); 
    }
    let companyNameArr = await OrganisationAdminService.findOrgByEmail(reqBody[TableFields.email]).withUniqueId().execute();
    if(companyNameArr.length ===0){ 
        throw new ValidationError(ValidationMsgs.CeoEmalExist);
    }
    let count = false;
    for(let companyName of  companyNameArr){
        if(companyName[TableFields.uniqueId].toString() ===reqBody[TableFields.orgId]){
           
            count = true;
            console.log('true statement');
            
        } 
    }
    if(count === false){
        throw new ValidationError(ValidationMsgs.InvalidOrgId);
    }
    else{
        let orgObject = await OrganisationAdminService.findOrgByUniqueId(reqBody[TableFields.orgId]).withTokenInfo().execute();
        console.log('this is orgObject',orgObject); 
        if(orgObject[TableFields.orgName]!==reqBody[TableFields.companyName]){
            throw new ValidationError(ValidationMsgs.IncorrectCompanyName);
        }
        const token = orgObject.createAuthToken(orgObject);
        await OrganisationAdminService.saveAuthToken(reqBody[TableFields.orgId],token);
        return {orgObject,token};
    }
}

exports.postForgotPassword = async (req, res) => {
    const receiverEmail = req.body[TableFields.email];
    if (!receiverEmail) throw new ValidationError(ValidationMsgs.EmailEmpty);
    if(Util.isEmail(receiverEmail)){
      throw new ValidationError(ValidationMsgs.EmailInvalid);
    }
    if(receiverEmail.length > 30){
      throw new ValidationError(ValidationMsgs.EmailLength);
    }
    emailUtil.SendForgotPasswordEmailOrg(receiverEmail);
};




