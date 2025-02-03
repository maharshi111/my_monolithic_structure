const {
  TableFields,
  ValidationMsgs,
  InterfaceTypes,
} = require("../../utils/constants");
const ValidationError = require("../../utils/ValidationError");
const OrganisationService = require("../../db/services/OrganisationService");
const emailUtil = require("../../utils/email");
const Util = require("../../utils/util");
var mongoose = require("mongoose");
const { MongoUtil } = require("../../db/mongoose");

exports.postAddOrganisation = async (req, res, next) => {
  const reqBody = req.body;

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
};

exports.postEditOrganisation = async (req, res) => {
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
 
  await pasrseAndValidateOrganisation(
    reqBody,
    req,
    existingOrganisation,
    true,
    async (updatedFields) => {
      let pastOrgCeo = await OrganisationService.findByIdOrgId(orgId)
        .withOrgCeo()
        .withUniqueId()
        .execute();

      await OrganisationService.editOrganisation(updatedFields, orgId);

      if (
        pastOrgCeo[TableFields.orgCEO][TableFields.email] !==
        reqBody[TableFields.ceoEmail].trim().toLowerCase()
      ) {
        await emailUtil.addOrganisationEmail(
          reqBody[TableFields.ceoEmail].trim().toLowerCase(),
          pastOrgCeo[TableFields.uniqueId]
        );
      }
    }
  );
};

exports.postDeleteOrganisation = async (req, res, next) => {
  const orgId = req.params[TableFields.ID];
  if (!MongoUtil.isValidObjectID(orgId)) {
    throw new ValidationError(ValidationMsgs.IdEmpty);
  }
  await OrganisationService.deleteOrganisation(orgId);
};

async function pasrseAndValidateOrganisation(
  reqBody,
  req,
  existingOrganisation = {},
  isUpdate = false,
  onValidationCompleted = async () => {}
) {
  if (isFieldEmpty(reqBody[TableFields.orgName])) {
    throw new ValidationError(ValidationMsgs.OrgNameEmpty);
  }

  if (isFieldEmpty(reqBody[TableFields.linkedinUrl])) {
    throw new ValidationError(ValidationMsgs.LinkedinUrlEmpty);
  }

  if (isFieldEmpty(reqBody[TableFields.websiteUrl])) {
    throw new ValidationError(ValidationMsgs.WebsiteUrlEmpty);
  }

  if (isFieldEmpty(reqBody[TableFields.country])) {
    throw new ValidationError(ValidationMsgs.CountryEmpty);
  }

  if (isFieldEmpty(reqBody[TableFields.city])) {
    throw new ValidationError(ValidationMsgs.CityEmpty);
  }

  if (isFieldEmpty(reqBody[TableFields.street])) {
    throw new ValidationError(ValidationMsgs.StreetEmpty);
  }

  if (isFieldEmpty(reqBody[TableFields.ceoName])) {
    throw new ValidationError(ValidationMsgs.OrgCeoEmpty);
  }
  
  if (isFieldEmpty(reqBody[TableFields.postalCode])) {
    throw new ValidationError(ValidationMsgs.PostalCodeEmpty);
  }

  if (reqBody[TableFields.postalCode].trim().length != 6) {
    console.log("inside");

    throw new ValidationError(ValidationMsgs.PostalCodeInvalid);
  }

  if (isFieldEmpty(reqBody[TableFields.ceoEmail])) {
    throw new ValidationError(ValidationMsgs.EmailEmpty);
  }
  
  if (isFieldEmpty(reqBody[TableFields.empStrength])) {
    throw new ValidationError(ValidationMsgs.EmployeeStrengthEmpty);
  }

  if (isFieldEmpty(reqBody[TableFields.subscriptionStart])) {
    throw new ValidationError(ValidationMsgs.DateEmpty);
  }
  //check 
  const result = Util.subscriptionStartInvalid(
    reqBody[TableFields.subscriptionStart].trim()
  );
  console.log("this is start date", reqBody[TableFields.subscriptionStart]);
  if (!result.success) {
    throw new ValidationError(result.msg);
  }

  if (isFieldEmpty(reqBody[TableFields.subscriptionPeriod])) {
    throw new ValidationError(ValidationMsgs.SubscriptionPeriodEmpty);
  }
//check 
  if (
    reqBody[TableFields.subscriptionPeriod].trim() <= 0 ||
    reqBody[TableFields.subscriptionPeriod].trim() > 60
  ) {
    throw new ValidationError(ValidationMsgs.SubscriptionPeriodInvalid);
  }

  if (isFieldEmpty(reqBody[TableFields.charge])) {
    throw new ValidationError(ValidationMsgs.SubscriptionChargeEmpty);
  }
//check 
  if (+reqBody[TableFields.charge].trim() > 999999) {
    throw new ValidationError(ValidationMsgs.SubscriptionChargeInvalid);
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
      [TableFields.orgName]: reqBody[TableFields.orgName].toUpperCase(),
      [TableFields.orgLinkedinUrl]: reqBody[TableFields.linkedinUrl].trim(),
      [TableFields.orgWebsiteUrl]: reqBody[TableFields.websiteUrl].trim(),
      [TableFields.orgHeadOffice]: {
        [TableFields.city]: reqBody[TableFields.city].trim(),
        [TableFields.street]: reqBody[TableFields.street].trim(),
        [TableFields.country]: reqBody[TableFields.country].trim(),
        [TableFields.postalCode]: reqBody[TableFields.postalCode].trim(),
      },
      [TableFields.orgCEO]: {
        [TableFields.name_]: reqBody[TableFields.ceoName].trim(),
        [TableFields.email]: reqBody[TableFields.ceoEmail].trim().toLowerCase(),
      },
      [TableFields.employeeStrength]: Number(
        reqBody[TableFields.empStrength].trim()
      ),
      [TableFields.startDateOfSubscription]: new Date(
        reqBody[TableFields.subscriptionStart].trim()
      ).toISOString(),
      [TableFields.subscriptionPeriod]: Number(
        reqBody[TableFields.subscriptionPeriod].trim()
      ),
      [TableFields.subscriptionCharge]: Number(
        reqBody[TableFields.charge].trim()
      ),
      ...(!isUpdate && {
        [TableFields.superAdminResponsible]: req.superAdminId,
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
