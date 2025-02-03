const mongoose = require("mongoose");
const validator = require("validator");
const Schema = mongoose.Schema;
const {
  ValidationMsgs,
  TableNames,
  TableFields,
  UserTypes,
} = require("../../utils/constants");
const jwt = require("jsonwebtoken");
const organisationSchema = new Schema(
  {
    [TableFields.orgName]: {
      type: String,
      trim: true,
      required: [true, ValidationMsgs.OrgNameEmpty],
    },
    [TableFields.orgAdmin]: {
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
      required: [true, ValidationMsgs.LinkedinUrlEmpty],
    },
    [TableFields.orgWebsiteUrl]: {
      type: String,
      trim: true,
      required: [true, ValidationMsgs.WebsiteUrlEmpty],
    },
    [TableFields.orgHeadOffice]: {
      [TableFields.city]: {
        type: String,
        trim: true,
        required: [true, ValidationMsgs.CityEmpty],
      },
      [TableFields.street]: {
        type: String,
        trim: true,
        required: [true, ValidationMsgs.StreetEmpty],
      },
      [TableFields.country]: {
        type: String,
        trim: true,
        required: [true, ValidationMsgs.CountryEmpty],
      },
      [TableFields.postalCode]: {
        type: String,
        trim: true,
        required: [true, ValidationMsgs.PostalCodeEmpty],
      },
    },
    [TableFields.orgCEO]: {
      [TableFields.name_]: {
        type: String,
        trim: true,
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
      required: [true, ValidationMsgs.EmployeeStrengthEmpty],
    },
    [TableFields.startDateOfSubscription]: {
      type: Date,
      required: [true, ValidationMsgs.DateEmpty],
    },
    [TableFields.subscriptionPeriod]: {
      type: Number,
      required: [true, ValidationMsgs.SubscriptionPeriodEmpty],
    },
    [TableFields.subscriptionCharge]: {
      type: Number,
      required: [true, ValidationMsgs.SubscriptionChargeEmpty],
    },
    [TableFields.superAdminResponsible]: {
      type: Schema.Types.ObjectId,
      ref: TableNames.SuperAdmin,
    },
    [TableFields.uniqueId]: {
      type: String,
      trim: true,
      required: [true, ValidationMsgs.UniqueIdEmpty],
    },
    [TableFields.tokens]: [
      {
        [TableFields.ID]: false,
        [TableFields.token]: {
          type: String,
        },
      },
    ],
    [TableFields._createdAt]: {
      type: Date,
      default: Date.now(),
    },
    [TableFields._updatedAt]: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: false,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret[TableFields.tokens];
        delete ret.__v;
      },
    },
  }
);

organisationSchema.methods.createAuthToken = function (org) {
  const token = jwt.sign(
    {
      [TableFields.ceoEmail]: org[TableFields.orgCEO][TableFields.email],
      [TableFields.organisationName]: org[TableFields.orgName],
      [TableFields.orgId]: org[TableFields.ID].toString(),
    },
    process.env.JWT_ORGANISATION_PK,
    { expiresIn: "5h" }
  );

  return token;
};
module.exports = mongoose.model(TableNames.Organisation, organisationSchema);
