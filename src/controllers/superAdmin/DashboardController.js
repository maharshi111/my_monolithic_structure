const OrganisationService = require("../../db/services/OrganisationService");
const SuperAdminService = require("../../db/services/SuperAdminServices");
const {
    TableFields,
    ValidationMsgs,
    InterfaceTypes,
    TableNames,
  } = require("../../utils/constants");



exports.superAdminDashboard = async (req) => {
    let superAdminReference =  req[TableFields.superAdminId];
    // await OrganisationService.organisationListnerForSuperAdmin(superAdminReference);
   return await SuperAdminService.findSuperAdminById(superAdminReference).withOrgCount().execute();
  
}