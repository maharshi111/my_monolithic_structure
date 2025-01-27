const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const {
  ValidationMsgs,
  TableNames,
  TableFields,
  UserTypes,
} = require("../../utils/constants");

const employeeSchema = new Schema(
  {
    [TableFields.firstName]: {
      type: String,
      required: [true, ValidationMsgs.FirstNameEmpty],
    },
    [TableFields.lastName]: {
      type: String,
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
      required: [true, ValidationMsgs.PasswordEmpty],
    },
    [TableFields.phone]: {
      type: String,
      required: [true, ValidationMsgs.PhoneEmpty],
      unique: true,
    },
    [TableFields.address]: {
      type: String,
      required: [true, ValidationMsgs.AddressEmpty],
    },
    [TableFields.dateOfBirth]: {
      type: Date,
      required: [true, ValidationMsgs.DateEmpty],
    },
    [TableFields.basicSalary]: {
      type: Number,
      required: [true, ValidationMsgs.SalaryEmpty],
    },
    [TableFields.bonuses]: [
      {
        [TableFields.bonusType]: { type: String },
        [TableFields.bonusAmount]: {
          type: Number,
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
        required: [true, ValidationMsgs.DepNameEmpty],
      },
    },
    [TableFields.role]: {
      type: String,
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
    }
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
module.exports = mongoose.model(TableNames.Employee, employeeSchema);
