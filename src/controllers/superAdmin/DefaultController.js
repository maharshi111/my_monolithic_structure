const {
  TableFields,
  ValidationMsgs,
  ValidationMsgsLength,
  InterfaceTypes,
} = require("../../utils/constants");
const ValidationError = require("../../utils/ValidationError");
const SuperAdminService = require("../../db/services/SuperAdminServices");
const emailUtil = require("../../utils/email");
const Util = require("../../utils/util");

exports.postAddOrganisation = async (req, res, next) => {
  //console.log("this is body", req.body);
    const reqBody = req.body;
    
    
    if (!reqBody[TableFields.orgName]) {
      throw new ValidationError(ValidationMsgs.OrgNameEmpty);
    }
    if (!Util.ValidationMsgsLength(reqBody[TableFields.orgName],30,3,[TableFields.orgName]).flag) {
        console.log(Util.ValidationMsgsLength(reqBody[TableFields.orgName],30,3,[TableFields.orgName]).message);
        
      throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.orgName],30,3,[TableFields.orgName]).message);
    }
    if (!reqBody[TableFields.linkedinUrl]) {
      throw new ValidationError(ValidationMsgs.LinkedinUrlEmpty);
    }
    if(!Util.isUrlValid(reqBody[TableFields.linkedinUrl])){
        throw new ValidationError(ValidationMsgs.UrlInvalid)
    }
    if (!reqBody[TableFields.websiteUrl]) {
      throw new ValidationError(ValidationMsgs.WebsiteUrlEmpty);
    }
    if(!Util.isUrlValid(reqBody[TableFields.websiteUrl])){
        throw new ValidationError(ValidationMsgs.UrlInvalid);
    }
    if (!reqBody[TableFields.country]) {
      throw new ValidationError(ValidationMsgs.CountryEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.country],70,0,[TableFields.country]).flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.country],70,0,[TableFields.country]).message);
    }
    if(!Util.isAlpha(reqBody[TableFields.country])){
      throw new ValidationError(ValidationMsgs.IsAlphaInvalidCountry);
    }
    if (!reqBody[TableFields.city]) {
      throw new ValidationError(ValidationMsgs.CityEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.city],70,0,[TableFields.city]).flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.city],70,0,[TableFields.city]).message);
    }
    if(!Util.isAlpha(reqBody[TableFields.city])){
        throw new ValidationError(ValidationMsgs.IsAlphaInvalidCity);
      }
    if (!reqBody[TableFields.street]) {
      throw new ValidationError(ValidationMsgs.StreetEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.street],100,0,[TableFields.street]).flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.street],100,0,[TableFields.street]).message);
    }
    if (!reqBody[TableFields.ceoName]) {
      throw new ValidationError(ValidationMsgs.OrgCeoEmpty);
    }
    if (!Util.ValidationMsgsLength(reqBody[TableFields.ceoName],30,0,[TableFields.ceoName]).flag) {
      throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.ceoName],30,0,[TableFields.ceoName]).message);
    }
    if (!reqBody[TableFields.postalCode]) {
    //   console.log("========");
    //   console.log(postalCode);

      throw new ValidationError(ValidationMsgs.PostalCodeEmpty);
    }
    
    if(!Util.isDigit(reqBody[TableFields.postalCode])){
        throw new ValidationError(ValidationMsgs.NumericInvalid);
    }

    if (reqBody[TableFields.postalCode].length != 6) {
      console.log("inside");

      throw new ValidationError(ValidationMsgs.PostalCodeInvalid);
    }
   
    if (!reqBody[TableFields.ceoEmail]) {
      throw new ValidationError(ValidationMsgs.EmailEmpty);
    }
    if(!Util.isEmail(reqBody[TableFields.ceoEmail])){
        throw new ValidationError(ValidationMsgs.EmailInvalid);
    }
    if (!Util.ValidationMsgsLength(reqBody[TableFields.ceoEmail],30,0,[TableFields.ceoEmail ]).flag) {
      throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.ceoEmail],30,0,[TableFields.ceoEmail ]).message);
    }
    console.log('value of emps',reqBody[TableFields.empStrength].toString());
    if(reqBody[TableFields.empStrength].trim()===""){
        throw new ValidationError(ValidationMsgs.EmployeeStrengthEmpty);
    }
    if(!Util.isDigit(reqBody[TableFields.empStrength])){
        throw new ValidationError(ValidationMsgs.NumericInvalid);
    }
    
    if (!Util.ValidationMsgsLength(reqBody[TableFields.empStrength],7,0,[TableFields.empStrength ]).flag) {
      throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.empStrength],7,0,[TableFields.empStrength ]).message);
    }
    if (reqBody[TableFields.subscriptionStart].trim()==="") {
      throw new ValidationError(ValidationMsgs.DateEmpty);
    }
    if(!Util.isDate(reqBody[TableFields.subscriptionStart])){
        throw new ValidationError(ValidationMsgs.invalidDate);
    }
    const result = Util.subscriptionStartInvalid(reqBody[TableFields.subscriptionStart]);
    console.log("this is start date",reqBody[TableFields.subscriptionStart]);
    if (!result.success) {
      throw new ValidationError(result.msg);
    }
    // console.log('subscriptionPeriod',subscriptionPeriod);
    // console.log(typeof(SubscriptionPeriod));
    
    if (reqBody[TableFields.subscriptionPeriod].trim() === "") {
      throw new ValidationError(ValidationMsgs.SubscriptionPeriodEmpty);
    }

    if(!Util.isDigit(reqBody[TableFields.subscriptionPeriod])){
        throw new ValidationError(ValidationMsgs.NumericInvalid);  
    }
    if (reqBody[TableFields.subscriptionPeriod] <= 0 || reqBody[TableFields.subscriptionPeriod] > 60) {
      throw new ValidationError(ValidationMsgs.SubscriptionPeriodInvalid);
    }
    // console.log(subscriptionCharge);
    
    // console.log(typeof(subscriptionCharge));
    
    if (!reqBody[TableFields.charge]) {
      throw new ValidationError(ValidationMsgs.SubscriptionChargeEmpty);
    }
    if(!Util.isDigit(reqBody[TableFields.charge])){
        throw new ValidationError(ValidationMsgs.invalidCharge);
    }
    if (+(reqBody[TableFields.charge]) > 999999) {
      throw new ValidationError(ValidationMsgs.SubscriptionChargeInvalid);
    }
    function uuidv4() {
      return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (
          +c ^
          (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
        ).toString(16)
      );
    }
    const uId = uuidv4();
    console.log('this is superAdminId:',req.superAdminId);
    
    const organisation = {
      [TableFields.orgName]: reqBody[TableFields.orgName],
      [TableFields.orgLinkedinUrl]: reqBody[TableFields.linkedinUrl],
      [TableFields.orgWebsiteUrl]: reqBody[TableFields.websiteUrl],
      [TableFields.orgHeadOffice]: {
        [TableFields.city]: reqBody[TableFields.city],
        [TableFields.street]: reqBody[TableFields.street],
        [TableFields.country]: reqBody[TableFields.country],
        [TableFields.postalCode]:  reqBody[TableFields.postalCode],
      },
      [TableFields.orgCEO]: {
        [TableFields.name_]: reqBody[TableFields.ceoName],
        [TableFields.email]: reqBody[TableFields.ceoEmail],
      },
      [TableFields.employeeStrength]: Number(reqBody[TableFields.empStrength]),
      [TableFields.startDateOfSubscription]:  new Date(reqBody[TableFields.subscriptionStart]).toISOString(),
      [TableFields.subscriptionPeriod]: Number(reqBody[TableFields.subscriptionPeriod]),
      [TableFields.subscriptionCharge]: Number(reqBody[TableFields.charge]),
      [TableFields.superAdminResponsible]: req.superAdminId,
      [TableFields.uniqueId]: uId,
    };

    await SuperAdminService.addOrganisation(organisation);
    
};

exports.postEditOrganisation = async (req, res) => {
  const OrgId = req.body.orgId;
  const OrgName = req.body.OrgName;
  const OrgLinkedinUrl = req.body.linkedinUrl;
  const OrgWebsiteUrl = req.body.websiteUrl;
  const City = req.body[TableFields.city];
  const Street = req.body[TableFields.street];
  const Country = req.body[TableFields.country];
  const PostalCode = parseInt(req.body[TableFields.postalCode], 10);
  const CeoName = req.body[TableFields.ceoName];
  const CeoEmail = req.body[TableFields.ceoEmail];
  const EmployeeStrength = parseInt(req.body.empStrength, 10);
  const StartDateOfSubscription = req.body.subscriptionStart;
  const SubscriptionPeriod = parseInt(
    req.body[TableFields.subscriptionPeriod],
    10
  );
  const SubscriptionCharge = parseInt(req.body.charge, 10);

  if (!OrgName) {
    throw new ValidationError(ValidationMsgs.OrgNameEmpty);
  }
  if (OrgName.length < 3 || OrgName.length > 30) {
    throw new ValidationError(ValidationMsgs.OrgNameLength);
  }
  if (!OrgLinkedinUrl) {
    throw new ValidationError(ValidationMsgs.LinkedinUrlEmpty);
  }
  if (!OrgWebsiteUrl) {
    throw new ValidationError(ValidationMsgs.WebsiteUrlEmpty);
  }
  if (!Country) {
    throw new ValidationError(ValidationMsgs.CountryEmpty);
  }
  if (!City) {
    throw new ValidationError(ValidationMsgs.CityEmpty);
  }
  if (!Street) {
    throw new ValidationError(ValidationMsgs.StreetEmpty);
  }
  if (!CeoName) {
    throw new ValidationError(ValidationMsgs.OrgCeoEmpty);
  }
  if (CeoName.length > 30) {
    throw new ValidationError(ValidationMsgs.OrgCeoInvalidLength);
  }
  if (!PostalCode) {
    throw new ValidationError(ValidationMsgs.PostalCodeEmpty);
  }
  if (!CeoEmail) {
    throw new ValidationError(ValidationMsgs.EmailEmpty);
  }
  if (CeoEmail.length > 30) {
    throw new ValidationError(ValidationMsgs.EmailLength);
  }
  if (!EmployeeStrength) {
    throw new ValidationError(ValidationMsgs.EmployeeStrengthEmpty);
  }
  if (EmployeeStrength.length > 7) {
    throw new ValidationError(ValidationMsgs.EmployeeStrengthInvalid);
  }
  if (!StartDateOfSubscription) {
    throw new ValidationError(ValidationMsgs.DateEmpty);
  }
  const result = Util.subscriptionStartInvalid(StartDateOfSubscription);
  console.log("this is start date", StartDateOfSubscription);
  if (!result.success) {
    throw new Error(result.msg);
  }
  if (!SubscriptionPeriod) {
    throw new ValidationError(ValidationMsgs.SubscriptionPeriodEmpty);
  }
  if (!SubscriptionCharge) {
    throw new ValidationError(ValidationMsgs.SubscriptionChargeEmpty);
  }
  if (SubscriptionCharge.length > 6) {
    throw new ValidationError(ValidationMsgs.SubscriptionChargeInvalid);
  }
  const organisation = {
    [TableFields.orgName]: OrgName,
    [TableFields.orgLinkedinUrl]: OrgLinkedinUrl,
    [TableFields.orgWebsiteUrl]: OrgWebsiteUrl,
    [TableFields.orgHeadOffice]: {
      [TableFields.city]: City,
      [TableFields.street]: Street,
      [TableFields.country]: Country,
      [TableFields.postalCode]: PostalCode,
    },
    [TableFields.orgCEO]: {
      [TableFields.name_]: CeoName,
      [TableFields.email]: CeoEmail,
    },
    [TableFields.employeeStrength]: EmployeeStrength,
    [TableFields.startDateOfSubscription]: StartDateOfSubscription,
    [TableFields.subscriptionPeriod]: SubscriptionPeriod,
    [TableFields.subscriptionCharge]: SubscriptionCharge,
    [TableFields.superAdminResponsible]: req.superAdminId,
  };
};
