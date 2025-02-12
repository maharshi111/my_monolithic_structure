const {
  TableFields,
  ValidationMsgs,
  InterfaceTypes,
} = require("../../utils/constants");
const ValidationError = require("../../utils/ValidationError");
const SuperAdminService = require("../../db/services/SuperAdminServices");
const emailUtil = require("../../utils/email");
const Util = require("../../utils/util");
const EmployeeService = require("../../db/services/EmployeeService");
const OrganisationService = require("../../db/services/OrganisationService");
var mongoose = require("mongoose");
const { MongoUtil } = require("../../db/mongoose");
const DepartmentService = require("../../db/services/DepartmentService");

exports.ajaxCeo = async (req, res, next) => {
  if (!req.body[TableFields.ceoEmail]) {
    throw new ValidationError(ValidationMsgs.RequiredField);
  }
  const ceoEmail = req.body[TableFields.ceoEmail].trim().toLowerCase();
  let org = await OrganisationService.findOneOrgByEmail(ceoEmail)
    .withBasicInfoOrg()
    .execute();
  if (!org) {
    throw new ValidationError(ValidationMsgs.CeoEmalExist);
  }
};

exports.ajaxOrgName = async (req, res, next) => {
  if (!req.body[TableFields.companyName]) {
    throw new ValidationError(ValidationMsgs.RequiredField);
  }
  const orgName = req.body[TableFields.companyName].toUpperCase();
  let companyName = await OrganisationService.findOneByOrgName(orgName)
    .withBasicInfoOrg()
    .execute();
  console.log("-->", companyName);

  if (!companyName) {
    throw new ValidationError(ValidationMsgs.CompanyNameNotFound);
  }

  if (!req.body[TableFields.ceoEmail]) {
    throw new ValidationError(ValidationMsgs.CeoEmailThanCompanyName);
  }
  const ceoEmail = req.body[TableFields.ceoEmail].trim().toLowerCase();
  if (companyName[TableFields.orgCEO][TableFields.email] !== ceoEmail) {
    throw new ValidationError(ValidationMsgs.VerifyAndRewriteCeoEmail);
  }
};

exports.ajaxOrgId = async (req, res, next) => {
  const orgId = req.body[TableFields.orgId];

  if (!orgId) {
    throw new ValidationError(ValidationMsgs.RequiredField);
  }

  if (!req.body[TableFields.ceoEmail]) {
    throw new ValidationError(ValidationMsgs.CeoEmailThanOrgId);
  }

  const ceoEmail = req.body[TableFields.ceoEmail].trim().toLowerCase();

  let companyNameArr = await OrganisationService.findOrgByEmail(ceoEmail)
    .withBasicInfoOrg()
    .execute();

  if (companyNameArr.length === 0) {
    throw new ValidationError(ValidationMsgs.FirstCorrectCeoEmail);
  }

 // let count = false;

//   for (let companyName of companyNameArr) {
//     if (companyName[TableFields.uniqueId].toString() === orgId) {
//       count = true;
//     }
//   }
// if (count === false) {
//     throw new ValidationError(ValidationMsgs.InvalidOrgId);
//   }
const exist =   companyNameArr.some((companyName)=>{
    return companyName[TableFields.uniqueId].toString() === orgId;
});
if (!exist) {
    throw new ValidationError(ValidationMsgs.InvalidOrgId);
  } 

};

exports.ajaxManagerEmail = async (req, res, next) => {
 

  if (!req.body[TableFields.email]) {
    throw new ValidationError(ValidationMsgs.RequiredField);
  }

  if (!req.body[TableFields.name_]) {
    throw new ValidationError(ValidationMsgs.FirstFillManagerName);
  }

  const managerEmail = req.body[TableFields.email].trim().toLowerCase(); //wwork email
  const managerName = req.body[TableFields.name_].trim();

  let emp = await EmployeeService.findEmpByWorkEmail(managerEmail)
    .withNameInfoEmp()
    .execute();

  if (!emp) {
    throw new ValidationError(ValidationMsgs.WorkEmailNotExists);
  }

  let arr = managerName.split(" ");
  let ln = arr[0].toUpperCase();
  let fn = arr.pop().toUpperCase();

  if (fn !== emp[TableFields.firstName] || ln !== emp[TableFields.lastName]) {
    throw new ValidationError(ValidationMsgs.NameAndEmailMistmatch);
  }
};

exports.ajaxDepName = async (req, res, next) => {

  if (!req.body[TableFields.departmentName]) {
    throw new ValidationError(ValidationMsgs.RequiredField);
  }
  const depName = req.body[TableFields.departmentName].trim().toUpperCase();

  const orgId = new mongoose.Types.ObjectId(req[TableFields.orgId]);

  let empArr = await EmployeeService.findEmpByOrgId(orgId)
    .withBasicInfoEmp()
    .execute();

  if (empArr.length !== 0) {
    let departmentNameArr = await DepartmentService.findDepByOrgId(orgId)
      .withBasicInfoDep()
      .execute();
    // let flag = false;

    // for (let dep of departmentNameArr) {
    //   if (dep[TableFields.departmentName] === depName) {
    //     flag = true;
    //   }
    // }
    // if (flag === false) {
    //     throw new ValidationError(ValidationMsgs.DepartmentNotExists);
    //   }
    const exist = departmentNameArr.some((dep)=>{
        return dep[TableFields.departmentName] === depName;
    })
       if (!exist) {
        throw new ValidationError(ValidationMsgs.DepartmentNotExists);
      }
  }
};
