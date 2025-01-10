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
    [TableFields.reference]: {
      type: Schema.Types.ObjectId,
      ref: TableNames.Employee,
    },
    [TableFields.email]: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          if (!validator.isEmail(v)) {
            return false;
          } else {
            return true;
          }
        },
        message: (props) => ValidationMsgs.EmailInvalid,
      },
    },
  },
  [TableFields.orgLinkedinUrl]: {
    type: String,
    trim: true,
    // validate: {
    //   validator: function (v) {
    //     if (!validator.isURL(v)) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   },
    //   message: (props) => ValidationMsgs.UrlInvalid,
    // },
    required: [true, ValidationMsgs.LinkedinUrlEmpty],
  },
  [TableFields.orgWebsiteUrl]: {
    type: String,
    trim: true,
    // validate: {
    //   validator: function (v) {
    //     if (!validator.isURL(v)) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   },
    //   message: (props) => ValidationMsgs.UrlInvalid,
    // },
    required: [true, ValidationMsgs.WebsiteUrlEmpty],
  },
  [TableFields.orgHeadOffice]: {
    [TableFields.city]: {
      type: String,
    //   validate: {
    //     validator: function (v) {
    //       if (!validator.isAlpha(v)) {
    //         return false;
    //       } else {
    //         return true;
    //       }
    //     },
    //     message: (props) => ValidationMsgs.IsAlphaInvalidCity,
    //   },
      required: [true, ValidationMsgs.CityEmpty],
    },
    [TableFields.street]: {
      type: String,
      required: [true, ValidationMsgs.StreetEmpty],
    },
    [TableFields.country]: {
      type: String,
    //   validate: {
    //     validator: function (v) {
    //       if (!validator.isAlpha(v)) {
    //         return false;
    //       } else {
    //         return true;
    //       }
    //     },
    //     message: (props) => ValidationMsgs.IsAlphaInvalidCountry,
    //   },
      required: [true, ValidationMsgs.CountryEmpty],
    },
    [TableFields.postalCode]: {
      type: String,
    //   validate: {
    //     validator: function (v) {
    //       if (!validator.isNumeric(v)) {
    //         return false;
    //       } else {
    //         return true;
    //       }
    //     },
    //     message: (props) => ValidationMsgs.NumericInvalid,
    //   },
      required: [true, ValidationMsgs.PostalCodeEmpty],
    },
  },
  [TableFields.orgCEO]: {
    [TableFields.name_]: {
      type: String,
      required: [true, ValidationMsgs.OrgCeoEmpty],
    },
    [TableFields.email]: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          if (!validator.isEmail(v)) {
            return false;
          } else {
            return true;
          }
        },
        message: (props) => ValidationMsgs.EmailInvalid,
      },
      required: [true, ValidationMsgs.EmailEmpty],
    },
  },
  [TableFields.employeeStrength]: {
    type: Number,
    // validate: {
    //   validator: function (v) {
    //     if (!validator.isNumeric(v)) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   },
    //   message: (props) => ValidationMsgs.NumericInvalid,
    // },
    required: [true, ValidationMsgs.EmployeeStrengthEmpty],
  },
  [TableFields.startDateOfSubscription]: {
    type: Date,

    // validate: {
    //   validator: function (v) {
    //     if (!validator.isDate(v)) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   },
    //   message: (props) => ValidationMsgs.DateInvalid,
    // },
    required: [true, ValidationMsgs.DateEmpty],
  },
  [TableFields.subscriptionPeriod]: {
    type: Number,
  
    // validate: {
    //   validator: function (v) {
    //     if (!validator.isNumeric(v)) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    //   },
    //   message: (props) => ValidationMsgs.NumericInvalid,
    // },
    required: [true, ValidationMsgs.SubscriptionPeriodEmpty],
  },
  [TableFields.subscriptionCharge]: {
    type: Number,
    // validate(value) {
    //   if (!validator.isNumeric(value)) {
    //     throw new ValidationError(ValidationMsgs.NumericInvalid);
    //   }
    // },
    // validate: {
    //   validator: function (v) {
    //     console.log('inside v fun',typeof v);
    //     console.log('value inside v fun',v);
        
    //     if (!validator.isNumeric(v)) {
    //         console.log('inside if v');
            
    //       return false;
    //     } else {
    //         console.log('else of v');
            
    //       return true;
    //     }
    //   },
    //   message: (props) => ValidationMsgs.NumericInvalid,
    // },
    required: [true, ValidationMsgs.SubscriptionChargeEmpty],
  },
  [TableFields.superAdminResponsible]: {
    type: Schema.Types.ObjectId,
    ref: TableNames.SuperAdmin,
    //required: [true, ValidationMsgs.SuperAdminResponsibleEmpty],
  },
  [TableFields.uniqueId]: {
    type: String,
    required: [true, ValidationMsgs.UniqueIdEmpty],
  },
});

module.exports = mongoose.model( TableNames.Organisation, organisationSchema);
