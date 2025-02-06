const {
  TableFields,
  ValidationMsgs,
  InterfaceTypes,
} = require("../../utils/constants");
const ValidationError = require("../../utils/ValidationError");
const OrganisationService = require("../../db/services/OrganisationService");
const EmployeeService = require("../../db/services/EmployeeService");
const emailUtil = require("../../utils/email");
const Util = require("../../utils/util");
var mongoose = require("mongoose");
const { MongoUtil } = require("../../db/mongoose");

exports.addEditAdmin = async (req, res, next) => {
  const reqBody = req.body;
  if (!reqBody[TableFields.ceoEmail]) {
    throw new ValidationError(ValidationMsgs.EmailEmpty);
  }
  if (!Util.isEmail(reqBody[TableFields.ceoEmail].trim().toLowerCase())) {
    throw new ValidationError(ValidationMsgs.EmailInvalid);
  }
  if (
    !Util.ValidationMsgsLength(reqBody[TableFields.ceoEmail], 30, 0, [
      TableFields.ceoEmail,
    ]).flag
  ) {
    throw new ValidationError(
      Util.ValidationMsgsLength(reqBody[TableFields.ceoEmail], 30, 0, [
        [TableFields.ceoEmail],
      ]).message
    );
  }
  if (!reqBody[TableFields.adminEmail]) {
    throw new ValidationError(ValidationMsgs.EmailEmpty);
  }
  if (!Util.isEmail(reqBody[TableFields.adminEmail].trim())) {
    throw new ValidationError(ValidationMsgs.EmailInvalid);
  }
  if (
    !Util.ValidationMsgsLength(reqBody[TableFields.adminEmail], 30, 0, [
      TableFields.adminEmail,
    ]).flag
  ) {
    throw new ValidationError(
      Util.ValidationMsgsLength(reqBody[TableFields.adminEmail], 30, 0, [
        TableFields.adminEmail,
      ]).message
    );
  }
  let org = await OrganisationService.findOneOrgByEmail(
    reqBody[TableFields.ceoEmail].trim().toLowerCase()
  )
    .withOrgCeo()
    .withOrgAdmin()
    .execute();
  if (!org) {
    throw new ValidationError(ValidationMsgs.CeoEmalExist);
  }
  let employee = await EmployeeService.findOneEmpByEmail(
    reqBody[TableFields.adminEmail].trim().toLowerCase()
  )
    .withEmployeeBasicInfo()
    .execute();
  console.log("////", employee);

  if (!employee) {
    throw new ValidationError(ValidationMsgs.EmployeeEmailExist);
  }
  const orgId = new mongoose.Types.ObjectId(
    employee[TableFields.organisationId]
  );

  org = await OrganisationService.findByIdOrgId(orgId).withOrgCeo().execute();

  if (
    org[TableFields.orgCEO][TableFields.email] !==
    reqBody[TableFields.ceoEmail].trim().toLowerCase()
  ) {
    throw new ValidationError(ValidationMsgs.EmpOrgMismatch);
  }
  const empId = new mongoose.Types.ObjectId(employee[TableFields.ID]);

  let orgObject = {
    [TableFields.reference]: empId,
    [TableFields.email]: reqBody[TableFields.adminEmail],
  };
  await OrganisationService.addEditAdmin(orgObject, orgId);
};
