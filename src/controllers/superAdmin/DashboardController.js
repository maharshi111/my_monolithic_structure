const OrganisationService = require("../../db/services/OrganisationService");
const {
    TableFields,
    ValidationMsgs,
    InterfaceTypes,
    TableNames,
  } = require("../../utils/constants");



exports.superAdminDashboard = async (req) => {
    let superAdminReference =  req[TableFields.superAdminId];
    await OrganisationService.organisationListnerForSuperAdmin(superAdminReference);
}