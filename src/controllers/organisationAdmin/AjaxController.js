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

exports.postAjaxCeo = async (req, res, next) => {
  const ceoEmail = req.body[TableFields.ceoEmail].trim().toLowerCase();
  if (!ceoEmail) {
    throw new ValidationError(ValidationMsgs.RequiredField);
  }
  let org = await OrganisationService.findOneOrgByEmail(ceoEmail)
    .withBasicInfoOrg()
    .execute();
  if (!org) {
    throw new ValidationError(ValidationMsgs.CeoEmalExist);
  }
};

exports.postAjaxOrgName = async (req, res, next) => {
  const orgName = req.body[TableFields.companyName].toUpperCase();
  const ceoEmail = req.body[TableFields.ceoEmail].trim().toLowerCase();
  if (!orgName) {
    throw new ValidationError(ValidationMsgs.RequiredField);
  }
  let companyName = await OrganisationService.findOneByOrgName(orgName)
    .withBasicInfoOrg()
    .execute();
  console.log("-->", companyName);

  if (!companyName) {
    throw new ValidationError(ValidationMsgs.CompanyNameNotFound);
  }

  if (!ceoEmail) {
    throw new ValidationError(ValidationMsgs.CeoEmailThanCompanyName);
  }

  if (companyName[TableFields.orgCEO][TableFields.email] !== ceoEmail) {
    throw new ValidationError(ValidationMsgs.VerifyAndRewriteCeoEmail);
  }
};

exports.postAjaxOrgId = async (req, res, next) => {
  const ceoEmail = req.body[TableFields.ceoEmail].trim().toLowerCase();
  const orgId = req.body[TableFields.orgId];

  if (orgId === "") {
    throw new ValidationError(ValidationMsgs.RequiredField);
  }

  if (!ceoEmail) {
    throw new ValidationError(ValidationMsgs.CeoEmailThanOrgId);
  }

  let companyNameArr = await OrganisationService.findOrgByEmail(ceoEmail)
    .withBasicInfoOrg()
    .execute();

  if (companyNameArr.length === 0) {
    throw new ValidationError(ValidationMsgs.FirstCorrectCeoEmail);
  }

  let count = false;

  for (let companyName of companyNameArr) {
    if (companyName[TableFields.uniqueId].toString() === orgId) {
      count = true;
    }
  }

  if (count === false) {
    throw new ValidationError(ValidationMsgs.InvalidOrgId);
  }
};

exports.postAjaxManagerEmail = async (req, res, next) => {
  const managerEmail = req.body[TableFields.email].trim().toLowerCase();
  const managerName = req.body[TableFields.name_].trim();

  if (!managerEmail) {
    throw new ValidationError(ValidationMsgs.RequiredField);
  }

  if (!managerName) {
    throw new ValidationError(ValidationMsgs.FirstFillManagerName);
  }

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

exports.postAjaxDepName = async (req, res, next) => {
  const depName = req.body[TableFields.departmentName].trim().toUpperCase();

  if (!depName) {
    throw new ValidationError(ValidationMsgs.RequiredField);
  }

  const orgId = new mongoose.Types.ObjectId(req.orgId);

  let empArr = await EmployeeService.findEmpByOrgId(orgId)
    .withBasicInfoEmp()
    .execute();

  if (empArr.length !== 0) {
    let departmentNameArr = await DepartmentService.findDepByOrgId(orgId)
      .withBasicInfoDep()
      .execute();
    let flag = false;

    for (let dep of departmentNameArr) {
      if (dep[TableFields.departmentName] === depName) {
        flag = true;
      }
    }

    if (flag === false) {
      throw new ValidationError(ValidationMsgs.DepartmentNotExists);
    }
  }
};
