const {
  TableFields,
  ValidationMsgs,
  InterfaceTypes,
  TableNames,
} = require("../../utils/constants");
const ValidationError = require("../../utils/ValidationError");
const OrganisationService = require("../../db/services/OrganisationService");
const emailUtil = require("../../utils/email");
const Util = require("../../utils/util");
var mongoose = require("mongoose");
const { MongoUtil } = require("../../db/mongoose");
const ServiceManager = require("../../db/serviceManager");

exports.addOrganisation = async (req, res, next) => {
  const reqBody = req.body;
  let superAdminReference =  req[TableFields.superAdminId];
  if (reqBody[TableFields.subscriptionStart]) {
    reqBody[TableFields.subscriptionStart] =
     new Date(reqBody[TableFields.subscriptionStart]).toISOString();
  }
  await pasrseAndValidateOrganisation(
    reqBody,
    req,
    undefined,
    false,
    async (updatedFields) => {
      await OrganisationService.addOrganisation(updatedFields);
      let receiverEmail = updatedFields[TableFields.orgCEO][TableFields.email];
      console.log(receiverEmail);

      console.log(1);

      await emailUtil.addOrganisationEmail(
        receiverEmail,
        updatedFields[TableFields.uniqueId]
      );
    }
  );
   OrganisationService.organisationListnerForSuperAdmin(superAdminReference);
};

exports.editOrganisation = async (req, res) => {
  const reqBody = req.body;
  console.log("this is req:", reqBody);

  const orgId = reqBody[TableFields.orgId];
  console.log("orgId", orgId);

  let existingOrganisation = await OrganisationService.findByIdOrgId(orgId)
    .withoutSuperAdminAndUniqueId()
    .execute();
  if (!existingOrganisation) {
    throw new ValidationError(ValidationMsgs.RecordNotFound);
  }
  console.log("===}}", existingOrganisation);
  if (reqBody[TableFields.subscriptionStart]) {
    reqBody[TableFields.subscriptionStart] = new Date(
      reqBody[TableFields.subscriptionStart]
    ).toISOString();
  }
  await pasrseAndValidateOrganisation(
    reqBody,
    req,
    existingOrganisation,
    true,
    async (updatedFields) => {
      console.log("this is updatedFields", updatedFields);

      let pastOrgCeo = await OrganisationService.findByIdOrgId(orgId)
        .withOrgCeo()
        .withUniqueId()
        .execute();

      await OrganisationService.editOrganisation(updatedFields, orgId);

      if (reqBody[TableFields.ceoEmail]) {
        if (
          pastOrgCeo[TableFields.orgCEO][TableFields.email] !==
          reqBody[TableFields.ceoEmail]
        ) {
          await emailUtil.addOrganisationEmail(
            reqBody[TableFields.ceoEmail],
            pastOrgCeo[TableFields.uniqueId]
          );
        }
      }
    }
  );
};

exports.deleteOrganisation = async (req, res, next) => {
  const orgId = req.params[TableFields.ID];
  let superAdminReference =  req[TableFields.superAdminId];

  if (!MongoUtil.isValidObjectID(orgId)) {
    throw new ValidationError(ValidationMsgs.IdEmpty);
  }

  if (!(await OrganisationService.recordExists(orgId))) {
    throw new ValidationError(ValidationMsgs.RecordNotFound);
  }
  console.log("&&&");

  //await OrganisationService.deleteOrganisation(orgId);
  console.log(1);
  await ServiceManager.cascadeDelete(TableNames.Organisation, orgId);
  console.log('outside listner'); 
  setTimeout(()=>{
    OrganisationService.organisationListnerForSuperAdmin(superAdminReference);
  },2000);

};

async function pasrseAndValidateOrganisation(
  reqBody,
  req,
  existingOrganisation = {},
  isUpdate = false,
  onValidationCompleted = async () => {}
) {
  if (
    isFieldEmpty(
      reqBody[TableFields.orgName],
      existingOrganisation[TableFields.orgName]
    )
  ) {
    throw new ValidationError(ValidationMsgs.OrgNameEmpty);
  }
  console.log("---------<>", existingOrganisation[TableFields.orgLinkedinUrl]);

  if (
    isFieldEmpty(
      reqBody[TableFields.linkedinUrl],
      existingOrganisation[TableFields.orgLinkedinUrl]
    )
  ) {
    throw new ValidationError(ValidationMsgs.LinkedinUrlEmpty);
  }

  if (
    isFieldEmpty(
      reqBody[TableFields.websiteUrl],
      existingOrganisation[TableFields.orgWebsiteUrl]
    )
  ) {
    throw new ValidationError(ValidationMsgs.WebsiteUrlEmpty);
  }

//   console.log(
//     "!!!",
//     existingOrganisation[TableFields.orgHeadOffice][TableFields.country]
//   );
  if (
    isFieldEmpty(
      reqBody[TableFields.country],
      existingOrganisation?.[TableFields.orgHeadOffice]?.[TableFields.country]
    )
  ) {
    throw new ValidationError(ValidationMsgs.CountryEmpty);
  }

  if (
    isFieldEmpty(
      reqBody[TableFields.city],
      existingOrganisation?.[TableFields.orgHeadOffice]?.[TableFields.city]
    )
  ) {
    throw new ValidationError(ValidationMsgs.CityEmpty);
  }

  if (
    isFieldEmpty(
      reqBody[TableFields.street],
      existingOrganisation?.[TableFields.orgHeadOffice]?.[TableFields.street]
    )
  ) {
    throw new ValidationError(ValidationMsgs.StreetEmpty);
  }

  if (
    isFieldEmpty(
      reqBody[TableFields.ceoName],
      existingOrganisation?.[TableFields.orgCEO]?.[TableFields.name_]
    )
  ) {
    throw new ValidationError(ValidationMsgs.OrgCeoEmpty);
  }

//   console.log(
//     ">>>>>>>-",
//     existingOrganisation[TableFields.orgHeadOffice][TableFields.postalCode]
//   );

  if (
    isFieldEmpty(
      reqBody[TableFields.postalCode],
      existingOrganisation?.[TableFields.orgHeadOffice]?.[TableFields.postalCode]
    )
  ) {
    throw new ValidationError(ValidationMsgs.PostalCodeEmpty);
  }

  if (reqBody[TableFields.postalCode]) {
    if (reqBody[TableFields.postalCode].length != 6) {
      console.log("inside");

      throw new ValidationError(ValidationMsgs.PostalCodeInvalid);
    }
  }

  if (
    isFieldEmpty(
      reqBody[TableFields.ceoEmail],
      existingOrganisation?.[TableFields.orgCEO]?.[TableFields.email]
    )
  ) {
    throw new ValidationError(ValidationMsgs.EmailEmpty);
  }

  if (
    isFieldEmpty(
      reqBody[TableFields.empStrength],
      existingOrganisation[TableFields.employeeStrength]
    )
  ) {
    throw new ValidationError(ValidationMsgs.EmployeeStrengthEmpty);
  }

  if (
    isFieldEmpty(
      reqBody[TableFields.subscriptionStart],
      existingOrganisation[TableFields.startDateOfSubscription]
    )
  ) {
    throw new ValidationError(ValidationMsgs.DateEmpty);
  }
  //check
  if (reqBody[TableFields.subscriptionStart]) {
    const result = Util.subscriptionStartInvalid(
      reqBody[TableFields.subscriptionStart].trim()
    );
    console.log("this is start date", reqBody[TableFields.subscriptionStart]);
    if (!result.success) {
      throw new ValidationError(result.msg);
    }
  }

  if (
    isFieldEmpty(
      reqBody[TableFields.subscriptionPeriod],
      existingOrganisation[TableFields.subscriptionPeriod]
    )
  ) {
    throw new ValidationError(ValidationMsgs.SubscriptionPeriodEmpty);
  }
  //check
  if (reqBody[TableFields.subscriptionPeriod]) {
    if (
      reqBody[TableFields.subscriptionPeriod].trim() <= 0 ||
      reqBody[TableFields.subscriptionPeriod].trim() > 60
    ) {
      throw new ValidationError(ValidationMsgs.SubscriptionPeriodInvalid);
    }
  }

  if (
    isFieldEmpty(
      reqBody[TableFields.charge],
      existingOrganisation[TableFields.subscriptionCharge]
    )
  ) {
    throw new ValidationError(ValidationMsgs.SubscriptionChargeEmpty);
  }
  //check
  if (reqBody[TableFields.charge]) {
    if (+reqBody[TableFields.charge].trim() > 999999) {
      throw new ValidationError(ValidationMsgs.SubscriptionChargeInvalid);
    }
  }

  try {
    function uuidv4() {
      return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (
          +c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
        ).toString(16)
      );
    }
    const uId = uuidv4();
    // console.log("this is superAdminId:", req.superAdminId);

    const organisation = {
      [TableFields.orgName]: reqBody[TableFields.orgName],
      [TableFields.orgLinkedinUrl]: reqBody[TableFields.linkedinUrl],
      [TableFields.orgWebsiteUrl]: reqBody[TableFields.websiteUrl],
      [TableFields.orgHeadOffice]: {
        [TableFields.city]:
          reqBody[TableFields.city] ||
          existingOrganisation[TableFields.orgHeadOffice][TableFields.city],
        [TableFields.street]:
          reqBody[TableFields.street] ||
          existingOrganisation[TableFields.orgHeadOffice][TableFields.street],
        [TableFields.country]:
          reqBody[TableFields.country] ||
          existingOrganisation[TableFields.orgHeadOffice][TableFields.country],
        [TableFields.postalCode]:
          reqBody[TableFields.postalCode] ||
          existingOrganisation[TableFields.orgHeadOffice][
            TableFields.postalCode
          ],
      },
      [TableFields.orgCEO]: {
        [TableFields.name_]:
          reqBody[TableFields.ceoName] ||
          existingOrganisation[TableFields.orgCEO][TableFields.name_],
        [TableFields.email]:
          reqBody[TableFields.ceoEmail] ||
          existingOrganisation[TableFields.orgCEO][TableFields.email],
      },
      [TableFields.employeeStrength]: reqBody[TableFields.empStrength],
      [TableFields.startDateOfSubscription]:
        reqBody[TableFields.subscriptionStart],
      [TableFields.subscriptionPeriod]: reqBody[TableFields.subscriptionPeriod],
      [TableFields.subscriptionCharge]: reqBody[TableFields.charge],
      ...(!isUpdate && {
        [TableFields.superAdminResponsible]: req[TableFields.superAdminId],
        [TableFields.uniqueId]: uId,
      }),
    };
    let response = await onValidationCompleted(organisation);
    return response;
  } catch (error) {
    throw error;
  }
}

function isFieldEmpty(providedField, existingField) {
  if (providedField != undefined) {
    if (providedField) {
      return false;
    }
  } else if (existingField) {
    return false;
  }
  return true;
}
