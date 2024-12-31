const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const {
  ValidationMsgs,
  TableNames,
  TableFields,
  UserTypes,
} = require("../../utils/constants");

const organisationSchema = new Schema({
  [TableFields.orgName]: {
    type: String,
    trim: true,
    required: [true, ValidationMsgs.orgNameEmpty],
  },
  [TableFields.orgAdmin]: {
    //  OrgAdminId:{type:Schema.Types.ObjectId, required:true, ref:'Employee'},
    [TableFields.reference]: { type: Schema.Types.ObjectId, ref: "Employee" },
    [TableFields.email]: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new ValidationError(ValidationMsgs.EmailInvalid);
        }
      },
      required: [true, ValidationMsgs.EmailEmpty],
    },
  },
  [TableFields.orgLinkedinUrl]: {
    type: String,
    trim: true,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new ValidationError(ValidationMsgs.UrlInvalid);
      }
    },
    required: [true, ValidationMsgs.LinkedinUrlEmpty],
  },
  [TableFields.orgWebsiteUrl]: {
    type: String,
    trim: true,
    validate(value) {
      if (!validator.isURL(value)) {
        throw new ValidationError(ValidationMsgs.UrlInvalid);
      }
    },
    required: [true, ValidationMsgs.WebsiteUrlEmpty],
  },
  [TableFields.orgHeadOffice]: {
    [TableFields.city]: {
      type: String,
      required: [true, ValidationMsgs.CityEmpty],
    },
    [TableFields.street]: {
      type: String,
      required: [true, ValidationMsgs.StreetEmpty],
    },
    [TableFields.country]: {
      type: String,
      required: [true, ValidationMsgs.CountryEmpty],
    },
    [TableFields.postalCode]: {
      type: Number,
      required: [true, ValidationMsgs.PostalCodeEmpty],
    },
  },
  [TableFields.orgCEO]: {
    [TableFields.name]: {
      type: String,
      required: [true, ValidationMsgs.OrgCeoEmpty],
    },
    [TableFields.email]: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new ValidationError(ValidationMsgs.EmailInvalid);
        }
      },
      required: [true, ValidationMsgs.EmailEmpty],
    },
  },
  [TableFields.employeeStrength]: {
    type: Number,
    required: [true, ValidationMsgs.EmployeeStrengthEmpty],
  },
  [TableFields.startDateOfSubscription]: {
    type: Date,
    validate(value) {
      if (!validator.isDate(value)) {
        throw new ValidationError(ValidationMsgs.DateInvalid);
      }
    },
    required: [true, ValidationMsgs.DateEmpty],
  },
  [TableFields.subscriptionPeriod]: {
    type: Number,
    required: [true, ValidationMsgs.SubscriptionPeriodEmpty],
  },
  [TableFields.subscriptionCharge]: {
    type: Number,
    required: true,
  },
  [TableFields.superAdminResponsible]: {
    type: Schema.Types.ObjectId,
    ref: "SuperAdmin",
  },
  [TableFields.uniqueId]: {
    type: String,
  },
});

module.exports = mongoose.model("Organisation", organisationSchema);
