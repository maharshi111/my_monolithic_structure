const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const {
  ValidationMsgs,
  TableNames,
  TableFields,
  UserTypes,
} = require("../../utils/constants");
const Util = require("../../utils/util");
const employeeSchema = new Schema(
  {
    [TableFields.firstName]: {
      type: String,
      trim: true,
      required: [true, ValidationMsgs.FirstNameEmpty],
    },
    [TableFields.lastName]: {
      type: String,
      trim: true,
      required: [true, ValidationMsgs.LastNameEmpty],
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
      unique: true,
    },
    [TableFields.workEmail]: {
      type: String,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new ValidationError(ValidationMsgs.EmailInvalid);
        }
      },
      required: [true, ValidationMsgs.EmailEmpty],
      unique: true,
    },
    [TableFields.password]: {
      type: String,
      trim: true,
      maxlength: [15, ValidationMsgs.PasswordLength],
      minlength: [5, ValidationMsgs.PasswordLength],
      required: [true, ValidationMsgs.PasswordEmpty],
    },
    [TableFields.phone]: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return v ? Util.isValidMobileNumber(v) : true;
        },
        message: (props) => ValidationMsgs.PhoneInvalid,
      },
      set: (v) => Util.trimLeadingZeros(v),
      required: [true, ValidationMsgs.PhoneEmpty],
      unique: true,
      // set: (v) => Util.trimLeadingZeros(v),
    },
    [TableFields.address]: {
      type: String,
      trim: true,
      required: [true, ValidationMsgs.AddressEmpty],
    },
    [TableFields.dateOfBirth]: {
      type: Date,
      required: [true, ValidationMsgs.DateEmpty],
    },
    [TableFields.basicSalary]: {
      type: Number,
      default: 0,
      required: [true, ValidationMsgs.SalaryEmpty],
    },
    [TableFields.bonuses]: [
      {
        [TableFields.bonusType]: { type: String, trim: true },
        [TableFields.bonusAmount]: {
          type: Number,
          default: 0,
        },
        [TableFields.dateGranted]: {
          type: Date,
        },
      },
    ],

    [TableFields.joiningDate]: {
      type: Date,
      required: [true, ValidationMsgs.DateEmpty],
    },
    [TableFields.department]: {
      [TableFields.reference]: {
        type: Schema.Types.ObjectId,
        ref: TableNames.Department,
      },
      [TableFields.name_]: {
        type: String,
        trim: true,
        required: [true, ValidationMsgs.DepNameEmpty],
      },
    },
    [TableFields.role]: {
      type: String,
      trim: true,
      required: [true, ValidationMsgs.RoleEmpty],
    },
    [TableFields.organisationId]: {
      type: Schema.Types.ObjectId,
      ref: TableNames.Organisation,
      required: [true, ValidationMsgs.OrganisationIdEmpty],
    },
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
        delete ret.__v;
      },
    },
  }
);
employeeSchema.index({ [TableFields.email]: 1 }, { unique: true });
employeeSchema.index({ [TableFields.workEmail]: 1 }, { unique: true });
employeeSchema.index({ [TableFields.phone]: 1 }, { unique: true });

module.exports = mongoose.model(TableNames.Employee, employeeSchema);
