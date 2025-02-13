const EmployeeService = require("../../db/services/EmployeeService");
const {
    TableFields,
    ValidationMsgs,
    TableNames,
    InterfaceTypes,
  } = require("../../utils/constants");

exports.employeeCount = async(req) =>{
    let organisationReference =   req[TableFields.orgId];
    await EmployeeService.employeeListnerForOrganisation(organisationReference);
}