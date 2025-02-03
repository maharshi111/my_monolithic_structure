const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const {
  ValidationMsgs,
  TableNames,
  TableFields,
  UserTypes,
} = require("../../utils/constants");

const departmentSchema = new Schema(
  {
    [TableFields.departmentName]: {
      type: String,
      trim: true,
      required: [true, ValidationMsgs.DepNameEmpty],
    },
    [TableFields.manager]: {
      [TableFields.reference]: {
        //Employee
        type: Schema.Types.ObjectId,
        required: [true, ValidationMsgs.ManagerReferenceEmpty],
        ref: TableNames.Employee,
      },
      [TableFields.name_]: {
        type: String,
        trim: true,
        required: [true, ValidationMsgs.ManagerNameEmpty],
      },
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
module.exports = mongoose.model(TableNames.Department, departmentSchema);
