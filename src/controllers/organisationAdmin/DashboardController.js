const DepartmentService = require("../../db/services/DepartmentService");
const EmployeeService = require("../../db/services/EmployeeService");
const OrganisationService = require("../../db/services/OrganisationService");
const {
    TableFields,
    ValidationMsgs,
    TableNames,
    InterfaceTypes,
  } = require("../../utils/constants");

exports.employeeCount = async(req) =>{
    let organisationReference =   req[TableFields.orgId];
   // await EmployeeService.employeeListnerForOrganisation(organisationReference);
   return await OrganisationService.findByIdOrgId(organisationReference).withTotalEmployeeCount().execute();
}

exports.departmentCount = async(req) =>{
    let organisationReference =   req[TableFields.orgId];
   // await DepartmentService.departmentListnerForOrganisation(organisationReference);
   return await OrganisationService.findByIdOrgId(organisationReference).withTotalDepartmentCount().execute();
}