const UserTypes = (function () {
  function UserTypes() {}
  UserTypes.Admin = 1;
  UserTypes.College = 2;
  return UserTypes;
})();

const Platforms = (function () {
  function Platforms() {}
  Platforms.Admin = 1;
  Platforms.College = 2;
  Platforms.Android = 3;
  Platforms.iOS = 4;
  return Platforms;
})();

const InterfaceTypes = (function () {
  function InterfaceType() {}
  InterfaceType.Admin = {
    AdminWeb: "i1",
  };
  InterfaceType.College = {
    CollegeWeb: "i2",
  };
  InterfaceType.Student = {
    StudentApp: "i3",
  };
  return InterfaceType;
})();

const ValidationMsgs = (function () {
  function ValidationMsgs() {}
  ValidationMsgs.UserNameEmpty = "User Name is a required field!";
  ValidationMsgs.AuthFail = "Please authenticate!";
  ValidationMsgs.EmailEmpty = "Email required!";
  ValidationMsgs.EmailInvalid = "Email is invalid.";
  ValidationMsgs.PasswordEmpty = "Password required!";
  ValidationMsgs.OrgNameEmpty = "organisation name is required!";
  ValidationMsgs.LinkedinUrlEmpty = "Linkedin url  is required!";
  ValidationMsgs.WebsiteUrlEmpty = "Website url  is required!";
  ValidationMsgs.UrlInvalid = "Url is invalid.";
  ValidationMsgs.CityEmpty = "City name is required!";
  ValidationMsgs.StreetEmpty = "Street name is required!";
  ValidationMsgs.CountryEmpty = "Country name is required!";
  ValidationMsgs.PostalCodeEmpty = "Postal Code is required!";
  ValidationMsgs.OrgCeoEmpty = "Organisation CEO name is required!";
  ValidationMsgs.EmployeeStrengthEmpty = "Employee Strength is required!";
  ValidationMsgs.DateInvalid = "Date is invalid.";
  ValidationMsgs.DateEmpty = "Date is required!";
  ValidationMsgs.SubscriptionPeriodEmpty = "Subscription Period is required!";
  ValidationMsgs.NumericInvalid = "only digits should be entered.";
  ValidationMsgs.SubscriptionPeriodInvalid =
    "Subscription period should be a greater than 0 and less than or equal to 60 months.";
  ValidationMsgs.SuperAdminResponsibleEmpty = "Super Admin Id is requied!!";
  ValidationMsgs.UniqueIdEmpty = "UniqueId is requied!!";
  ValidationMsgs.FirstNameEmpty = "First Name is requied!!";
  ValidationMsgs.LastNameEmpty = "Last Name is requied!!";
  ValidationMsgs.PhoneInvalid = "Phone number must be of 10 digits.";
  ValidationMsgs.PostalCodeInvalid = "Postal Code must be of 6 digits.";
  ValidationMsgs.PhoneEmpty = "Phone Number is requied!!";
  ValidationMsgs.AddressEmpty = "Address is requied!";
  ValidationMsgs.SalaryEmpty = "Basic salary is requied!";
  ValidationMsgs.DepNameEmpty = "Department name is requied!";
  ValidationMsgs.RoleEmpty = "Role is requied!";
  ValidationMsgs.OrganisationIdEmpty = "Organisation Id is requied!";
  ValidationMsgs.ManagerReferenceEmpty = `Manager's reference is requied!`;
  ValidationMsgs.ManagerNameEmpty = `Manager's name is requied!`;
  ValidationMsgs.UserNameLength = `User name should not be more than 70 characters`;
  ValidationMsgs.EmailLength = `Email should not be more than 30 characters`;
  ValidationMsgs.PasswordLength = `Password's length should be a minimum of 5 characters and a maximum of 15 characters`;
  ValidationMsgs.PasswordInvalid = "Password is invalid.";
  ValidationMsgs.OrgNameLength =
    "The length of Organisation name should be minimum of 3 charcaters and maximum of 30 characters";
  ValidationMsgs.IsAlphaInvalidCountry =
    "Only Alphabets are allowed in country name.";
  ValidationMsgs.IsAlphaInvalidCity =
    "Only Alphabets are allowed in city name.";
  ValidationMsgs.OrgCeoInvalidLength = `Organisation ceo's name must not me more than 30 charcahters`;
  ValidationMsgs.EmployeeStrengthInvalid = `maximum 7 digits are allowed`;
  ValidationMsgs.SubscriptionChargeEmpty = "Subscription Charge is required!";
  ValidationMsgs.SubscriptionChargeInvalid =
    "subscription charge shouldnot exceed 999,999";
  ValidationMsgs.UnableToLogin = "Incorrect email and/or password.";
  ValidationMsgs.InvalidDate = "Please enter date in valid format yyyy-mm-dd";
  ValidationMsgs.InvalidCharge = "Subscription charge must be a number";
  ValidationMsgs.CeoEmalExist = "No such ceo email exists";
  ValidationMsgs.EmployeeEmailExist = "No Employee of this Email found";
  ValidationMsgs.EmpOrgMismatch = `The employee doesnot belogs to this ceo's organisation`;
  ValidationMsgs.companyNameExist = "Company name is required";
  ValidationMsgs.InvalidCompanyName = "Invalid company name";
  ValidationMsgs.InvalidOrgId = "Invalid organisation Id";
  ValidationMsgs.OrgIdEmpty = "Organisation Id is required";
  ValidationMsgs.IncorrectCompanyName = "Incorrect company name";
  ValidationMsgs.IsAlphaNumericPassword = "Password mut be alpha numeric";
  ValidationMsgs.HeaderTokenAbsent = "Header Token is not found";
  ValidationMsgs.DecodedTokenFail = "Authentication failed due to wrong token";
  ValidationMsgs.InvalidToken = "Authentication failed due to invalid token";
  ValidationMsgs.DepartmentNotExists = "No such Department exists";
  ValidationMsgs.WorkEmailNotExists = "No such work email found";
  ValidationMsgs.NameAndEmailMistmatch =
    "Managers name and Email doesnot match, please verify it and rewrite email";
  ValidationMsgs.IdEmpty = "please enter a valid mongoose object Id";
  ValidationMsgs.BonusTypeEmpty = "please enter bonus type";
  ValidationMsgs.BonusAmountEmpty = "please enter bonus amount";
  ValidationMsgs.SuperAdminNotExists =
    "No super admin of the following email is found";
  ValidationMsgs.EmailThenPass =
    "First fill up the email and then rewrite password";
  ValidationMsgs.VerifyEmail = "Please verify email";
  ValidationMsgs.IncorrectPssword = "Incorrect password";
  ValidationMsgs.PassInvalidForEmail =
    "password is incorrect for the above email, after correcting email rewrite password";
  ValidationMsgs.CeoEmailEmpty = `Please enter CEO'S email`;
  ValidationMsgs.AdminEmailEmpty = `please enter the admin person email`;
  ValidationMsgs.RequiredField = "This is required field";
  ValidationMsgs.CompanyNameNotFound = "No such Company Name found";
  ValidationMsgs.CeoEmailThanCompanyName = `First fill in ceo's email and then rewrite company name`;
  ValidationMsgs.CeoEmailThanOrgId = `First fill in the ceo's mail and then rewrite organisation Id`;
  ValidationMsgs.VerifyAndRewriteCeoEmail = `Please verify and rewrite ceo's email`;
  ValidationMsgs.FirstCorrectCeoEmail = `first correct ceo's email and then rewrite it again`;
  ValidationMsgs.FirstFillManagerName = "First fill in the managers name field";
  ValidationMsgs.CeoEmailThanAdminEmail =
    "First verify CEO email and then rewrite admin email";
  ValidationMsgs.EmailAlreadyExists =
    "The following email already exists, please try a new email";
  ValidationMsgs.WorkEmailAlreadyExists =
    "The following work email already exists, please try a new email";
  ValidationMsgs.PhoneAlreadyExists =
    "The following phone number already exists, please try different phone number";
  return ValidationMsgs;
})();

const ValidationMsgsLength = (fieldName, maxlen, minlen) => {
  function ValidationMsgsLength(fieldName, maxlen, minlen) {}
  console.log("inside ValidationMsgLength");

  ValidationMsgsLength.msg = `The maximum and the minimum characters allowed for ${fieldName} field are ${maxlen} and ${minlen} respectively`;
  ValidationMsgsLength.maxMsg = `The maximum characters allowed for ${fieldName} field are ${maxlen}`;
  ValidationMsgsLength.minMsg = `The minimum characters allowed for ${fieldName} field are ${minlen}`;
  return ValidationMsgsLength;
};

const ResponseMessages = (function () {
  function ResponseMessages() {}
  ResponseMessages.Ok = "Ok";
  ResponseMessages.NotFound = "Data not found!";
  ResponseMessages.signInSuccess = "Sign In successfully!";
  ResponseMessages.signOutSuccess = "Sign Out successfully!";
  return ResponseMessages;
})();

const TableNames = (function () {
  function TableNames() {}
  TableNames.SuperAdmin = "superadmins";
  TableNames.Organisation = "organisations";
  TableNames.Employee = "employees";
  TableNames.Department = "departments";
  return TableNames;
})();

const AuthTypes = (function () {
  function types() {}
  types.Admin = 1;
  types.College = 2;
  return types;
})();

const TableFields = (function () {
  function TableFields() {}
  TableFields.ID = "_id";
  TableFields.token = "token";
  TableFields.tokens = "tokens";
  TableFields.email = "email"; //org,superadmin,emp table (I am taking personalEmail as email only in emp table)
  TableFields.password = "password";
  TableFields.orgName = "orgName";
  TableFields.orgAdmin = "orgAdmin";
  TableFields.linkedinUrl = "linkedinUrl";
  TableFields.websiteUrl = "websiteUrl";
  TableFields.orgLinkedinUrl = "orgLinkedinUrl";
  TableFields.orgWebsiteUrl = "orgWebsiteUrl";
  TableFields.orgHeadOffice = "orgHeadOffice";
  TableFields.city = "city";
  TableFields.street = "street";
  TableFields.country = "country";
  TableFields.postalCode = "postalCode";
  TableFields.orgCEO = "orgCEO";
  TableFields.name_ = "name"; // emp, org and dep table
  TableFields.empStrength = "empStrength";
  TableFields.employeeStrength = "employeeStrength";
  TableFields.subscriptionStart = "subscriptionStart";
  TableFields.startDateOfSubscription = "startDateOfSubscription";
  TableFields.subscriptionPeriod = "subscriptionPeriod";
  TableFields.charge = "charge";
  TableFields.subscriptionCharge = "subscriptionCharge";
  TableFields.superAdminResponsible = "superAdminResponsible";
  TableFields.uniqueId = "uniqueId";
  TableFields.firstName = "firstName";
  TableFields.lastName = "lastName";
  TableFields.workEmail = "workEmail";
  TableFields.phone = "phone";
  TableFields.address = "address";
  TableFields.dateOfBirth = "dateOfBirth";
  TableFields.basicSalary = "basicSalary";
  TableFields.bonuses = "bonuses";
  TableFields.bonusType = "bonusType";
  TableFields.bonusAmount = "bonusAmount";
  TableFields.dateGranted = "dateGranted";
  TableFields.joiningDate = "joiningDate";
  TableFields.department = "department";
  TableFields.reference = "reference"; //dep and manager id(emp and dep table)
  TableFields.role = "role";
  TableFields.organisationId = "organisationId"; //both in emp and dep
  TableFields.departmentName = "departmentName";
  TableFields.manager = "manager";
  TableFields.ceoName = "ceoName";
  TableFields.ceoEmail = "ceoEmail";
  TableFields.orgId = "orgId";
  TableFields.adminEmail = "adminEmail";
  TableFields.companyName = "companyName";
  TableFields.organisationName = "organisationName";
  TableFields.depName = "depName";
  TableFields.managerName = "managerName";
  TableFields.depId = "depId";
  TableFields.departmentId = "departmentId";
  TableFields.empId = "empId";
  TableFields.idString = "idString";
  TableFields._createdAt = "createdAt";
  TableFields._updatedAt = "updatedAt";
  return TableFields;
})();

const ResponseStatus = (function () {
  function ResponseStatus() {}
  ResponseStatus.Failed = 0;
  ResponseStatus.Success = 200;
  ResponseStatus.BadRequest = 400;
  ResponseStatus.Unauthorized = 401;
  ResponseStatus.NotFound = 404;
  ResponseStatus.UpgradeRequired = 426;
  ResponseStatus.AccountDeactivated = 3001;
  ResponseStatus.InternalServerError = 500;
  ResponseStatus.ServiceUnavailable = 503;
  return ResponseStatus;
})();

const ResponseFields = (function () {
  function ResponseFields() {}
  ResponseFields.status = "status";
  ResponseFields.message = "message";
  ResponseFields.result = "result";
  return ResponseFields;
})();

module.exports = {
  ValidationMsgs,
  TableNames,
  TableFields,
  ResponseStatus,
  ResponseFields,
  ResponseMessages,
  UserTypes,
  Platforms,
  InterfaceTypes,
  AuthTypes,
  ValidationMsgsLength,
};
