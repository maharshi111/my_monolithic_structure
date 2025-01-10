const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const {
  ValidationMsgs,
  TableNames,
  TableFields,
  UserTypes,
} = require("../../utils/constants");

const departmentSchema = new Schema({
  [TableFields.departmentName]: {
    type: String,
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
});
module.exports = mongoose.model(TableNames.Department, departmentSchema);
