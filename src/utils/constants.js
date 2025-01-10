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
  //   ValidationMsgs.InvalidAuthToken = "Invalid auth token.";
  //   ValidationMsgs.ParametersError = "Invalid parameters.";
  //   ValidationMsgs.RecordNotFound = "Record not found!";
  //   ValidationMsgs.AccountAlreadyExists =
  //     "Registration has already been completed.";
  //   ValidationMsgs.AccountNotRegistered = "Account not registered!";
  //   ValidationMsgs.PasswordEmpty = "Password required!";
  //   ValidationMsgs.EmailInvalid = "Email is invalid.";
  //   ValidationMsgs.PhoneInvalid = "Phone is invalid.";
  //   ValidationMsgs.PasswordInvalid = "Password is invalid.";
  //   ValidationMsgs.AuthFail = "Please authenticate!";
  //   ValidationMsgs.UnableToLogin = "Incorrect email and/or password.";
  //   ValidationMsgs.UserTypeEmpty = "User type required!";
  //   ValidationMsgs.NameEmpty = "Name required!";
  //   ValidationMsgs.EmailEmpty = "Email required!";
  //   ValidationMsgs.PhoneEmpty = "Phone number cannot be blank!";
  //   ValidationMsgs.PhoneCountryEmpty = "Phone country code cannot be blank!";
  //   ValidationMsgs.DuplicateEmail = "This email address is already in use!";
  //   ValidationMsgs.NewPasswordEmpty = "New password required!";
  //   ValidationMsgs.PassResetCodeEmpty = "Password reset code required!";
  //   ValidationMsgs.DuplicatePhone = "This phone number is already in use!";
  //   ValidationMsgs.InvalidPassResetCode = "Password reset code is invalid!";
  //   ValidationMsgs.UnableToForgotPassword =
  //     "User not active, unable to reset password.";
  //   ValidationMsgs.OldPasswordIncorrect = "Entered old password is incorrect.";
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
  ValidationMsgs.NumericInvalid =
    "only digits should be entered.";
  ValidationMsgs.SubscriptionPeriodInvalid =
    "Subscription period should be a greater than 0 and less than or equal to 60.";
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
  ValidationMsgs.notNumber = "The Entered value is not a number";
  ValidationMsgs.invalidDate = "Please enter date in valid format yyyy-mm-dd";
  ValidationMsgs.invalidCharge = "Subscription charge must be a number";
  return ValidationMsgs;
})();

// const ValidationMsgsLength = (function (maxlen,minlen) {
//     function ValidationMsgsLength(maxlen,minlen){}
//     ValidationMsgsLength.msg = `The maximum and the minimum characters allowed for this field are ${maxlen} and ${minlen} respectively`;
//     ValidationMsgsLength.maxMsg = `The maximum characters allowed for this field are ${maxlen}`;
//     ValidationMsgsLength.minMsg = `The minimum characters allowed for this field are ${minlen}`;
//     return ValidationMsgsLength;
// })()    

const ValidationMsgsLength = (fieldName,maxlen,minlen) =>{
    function ValidationMsgsLength(fieldName,maxlen,minlen){}
    console.log('inside ValidationMsgLength');
    
    ValidationMsgsLength.msg = `The maximum and the minimum characters allowed for ${fieldName} field are ${maxlen} and ${minlen} respectively`;
    ValidationMsgsLength.maxMsg = `The maximum characters allowed for ${fieldName} field are ${maxlen}`;
    ValidationMsgsLength.minMsg = `The minimum characters allowed for ${fieldName} field are ${minlen}`;
    return ValidationMsgsLength;
}


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
  //   TableNames.Admin = "admins";
  //   TableNames.College = "colleges";
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
  // TableFields.ID = "_id";
  // TableFields.userId = "userId";
  //TableFields.name_ = "name";
  // TableFields.userType = "userType";
  // TableFields.phoneCountry = "phoneCountry";
  // TableFields.phone = "phone";
  // TableFields.platform = "platform";
  // TableFields.passwordResetToken = "passwordResetToken";
  // TableFields.fcmTokens = "fcmTokens";
  // TableFields.token = "token";
  // TableFields._createdAt = "createdAt";
  // TableFields._updatedAt = "updatedAt";
  // TableFields.email = "email";
  // TableFields.password = "password";
  // TableFields.tokens = "tokens";
  // TableFields.approved = "approved";
  // TableFields.interface = "interface";
  // TableFields.active = "active";
  // TableFields.image = "image";
  // TableFields.thumbnail = "thumbnail";
  // TableFields.emailVerified = "emailVerified";
  // TableFields.regCompleted = "regCompleted";
  // TableFields.addedByAdmin = "addedByAdmin";
  // TableFields._createdAt = "_createdAt";
  // TableFields._updatedAt = "_updatedAt";
  // TableFields.deleted = "deleted";
  // TableFields._deletedAt = "_deletedAt";
  // TableFields.emailOTP = "emailOTP";
  // TableFields.authType = "authType";
  TableFields.ID = "_id";
  TableFields.token = "token";
  TableFields.tokens = "tokens";
  TableFields.email = "email"; //org,superadmin,emp table (I am taking personalEmail as email only in emp table)
  TableFields.password = "password";
  TableFields.orgName = "orgName";
  TableFields.orgAdmin = "orgAdmin";
  TableFields.linkedinUrl = 'linkedinUrl';
  TableFields.websiteUrl = 'websiteUrl';
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
  TableFields.subscriptionStart = 'subscriptionStart';
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
  ValidationMsgsLength
};
