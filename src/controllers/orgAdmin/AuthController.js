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
const { MongoUtil } = require("../../db/mongoose");
var mongoose = require('mongoose');
exports.postLogin = async(req,res,next) =>{
    const reqBody = req.body;
    // console.log('======:',reqBody);
    if(!reqBody[TableFields.email].trim()){
        throw new ValidationError(ValidationMsgs.EmailEmpty);
    }
    if(!Util.isEmail(reqBody[TableFields.email].trim().toLowerCase())){
        throw new ValidationError(ValidationMsgs.EmailInvalid);
    }
    let org = await OrganisationAdminService.findOneOrgByEmail(reqBody[TableFields.email].trim().toLowerCase()).withBasicInfoOrg().execute();
    if(!org){
        throw new ValidationError(ValidationMsgs.CeoEmalExist);
    }
    if(!reqBody[TableFields.companyName].trim()){
        throw new ValidationError(ValidationMsgs.companyNameExist);
    }
    org = await OrganisationAdminService.findOneByOrgName(reqBody[TableFields.companyName].trim().toUpperCase()).withBasicInfoOrg().execute();
    if(!org){
        throw new ValidationError(ValidationMsgs.InvalidCompanyName); 
    }
    if(!reqBody[TableFields.orgId].trim()){
        throw new ValidationError(ValidationMsgs.OrgIdEmpty); 
    }
    let companyNameArr = await OrganisationAdminService.findOrgByEmail(reqBody[TableFields.email].trim().toLowerCase()).withUniqueId().execute();
    if(companyNameArr.length ===0){ 
        throw new ValidationError(ValidationMsgs.CeoEmalExist);
    }
    let count = false;
    for(let companyName of  companyNameArr){
        if(companyName[TableFields.uniqueId].toString() ===reqBody[TableFields.orgId].trim()){
           
            count = true;
            console.log('true statement');
            
        } 
    }
    if(count === false){
        throw new ValidationError(ValidationMsgs.InvalidOrgId);
    }
    else{
        let orgObject = await OrganisationAdminService.findOrgByUniqueId(reqBody[TableFields.orgId].trim()).withTokenInfo().execute();
        console.log('this is orgObject',orgObject); 
        if(orgObject[TableFields.orgName]!==reqBody[TableFields.companyName].trim().toUpperCase()){
            throw new ValidationError(ValidationMsgs.IncorrectCompanyName);
        }
        const token = orgObject.createAuthToken(orgObject);
        await OrganisationAdminService.saveAuthToken(reqBody[TableFields.orgId].trim(),token);
        return {orgObject,token};
    }
}

exports.postForgotPassword = async (req, res) => {
    const receiverEmail = req.body[TableFields.email].trim().toLowerCase();
    if (!receiverEmail) throw new ValidationError(ValidationMsgs.EmailEmpty);
    if(!Util.isEmail(receiverEmail)){
      throw new ValidationError(ValidationMsgs.EmailInvalid);
    }
    if(receiverEmail.length > 30){
      throw new ValidationError(ValidationMsgs.EmailLength);
    }
    emailUtil.SendForgotPasswordEmailOrg(receiverEmail);
};


exports.postAjaxCeo = async(req,res,next) =>{
    const ceoEmail = req.body[TableFields.ceoEmail].trim().toLowerCase();
    if(!ceoEmail){
        throw new ValidationError(ValidationMsgs.RequiredField);
    }
    let org = await OrganisationAdminService.findOneOrgByEmail(ceoEmail).withBasicInfoOrg().execute();
    if(!org){
        throw new ValidationError(ValidationMsgs.CeoEmalExist)
    }
}

exports.postAjaxOrgName = async(req,res,next) =>{
    const orgName = req.body[TableFields.companyName].trim().toUpperCase();
    const ceoEmail = req.body[TableFields.ceoEmail].trim().toLowerCase();
    if(!orgName){
        throw new ValidationError(ValidationMsgs.RequiredField);
    }
    let companyName = await OrganisationAdminService.findOneByOrgName(orgName).withBasicInfoOrg().execute();
    //console.log('===>',companyName);
    
    if(!companyName){
        throw new ValidationError(ValidationMsgs.CompanyNameNotFound);
    }
    if(!ceoEmail){
        throw new ValidationError(ValidationMsgs.CeoEmailThanCompanyName);
    }
    if(companyName[TableFields.orgCEO][TableFields.email]!==ceoEmail){
        throw new ValidationError(ValidationMsgs.VerifyAndRewriteCeoEmail);
    }
}

exports.postAjaxOrgId = async(req,res,next) =>{
    const ceoEmail = req.body[TableFields.ceoEmail].trim().toLowerCase();
    //const orgName = req.body[TableFields.companyName].trim().toUpperCase();
    const orgId = req.body[TableFields.orgId];
    if(orgId===""){
        throw new ValidationError(ValidationMsgs.RequiredField);
    }
    if(!ceoEmail){
        throw new ValidationError(ValidationMsgs.CeoEmailThanOrgId);
    }
    let companyNameArr = await OrganisationAdminService.findOrgByEmail(ceoEmail).withBasicInfoOrg().execute();
    if(companyNameArr.length ===0){
        throw new ValidationError(ValidationMsgs.FirstCorrectCeoEmail);
    }
    let count = false;
    for(let companyName of  companyNameArr){
        if(companyName[TableFields.uniqueId].toString() === orgId){
            count =true;
        }
    }
    if(count === false){
        throw new ValidationError(ValidationMsgs.InvalidOrgId);
    }
}

exports.postAjaxManagerEmail = async(req,res,next)=>{
    const managerEmail = req.body[TableFields.email].trim().toLowerCase();
    const managerName = req.body[TableFields.name_].trim();

    if(!managerEmail){
        throw new ValidationError(ValidationMsgs.RequiredField);
    }
    if(!managerName){
        throw new ValidationError(ValidationMsgs.FirstFillManagerName);
    }
    let emp = await OrganisationAdminService.findEmpByWorkEmail(managerEmail).withNameInfoEmp().execute();
    if(!emp){
        throw new ValidationError(ValidationMsgs.WorkEmailNotExists);
    }
  
    
    //console.log([...managerName]); 
    let arr = managerName.split(' ');

    //console.log(arr);
    
    let ln = arr[0].toUpperCase(); 
    let fn = arr.pop().toUpperCase();

    if(fn!==emp[TableFields.firstName] || ln!==emp[TableFields.lastName]){
        throw new ValidationError(ValidationMsgs.NameAndEmailMistmatch);
        
    }
}

exports.postAjaxDepName = async(req,res,next)=>{
    const depName = req.body[TableFields.departmentName].trim().toUpperCase();
    if(!depName){
        throw new ValidationError(ValidationMsgs.RequiredField);
    }
    const orgId = new mongoose.Types.ObjectId(req.orgId);
    //console.log(orgId);
    
    let empArr = await OrganisationAdminService.findEmpByOrgId(orgId).withBasicInfoEmp().execute();
    if(empArr.length !== 0){
       let departmentNameArr = await OrganisationAdminService.findDepByOrgId(orgId).withBasicInfoDep().execute()
       let flag = false;
        for(let dep of departmentNameArr ){
            if(dep[TableFields.departmentName] === depName){
                flag = true
            }
        }
        if(flag === false){
            throw new ValidationError(ValidationMsgs.DepartmentNotExists);      
        } 
      
    } 
}


