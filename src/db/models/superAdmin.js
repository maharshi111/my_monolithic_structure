const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const util = require("../../utils/util");
const {
  ValidationMsgs,
  TableNames,
  TableFields,
  UserTypes,
} = require("../../utils/constants");
const bcrypt = require("bcryptjs");
const ValidationError = require("../../utils/ValidationError");
const superAdminSchema = new Schema({
  [TableFields.name_]: {
    type: String,
    trim: true,
    required: [true, ValidationMsgs.UserNameEmpty],
  },
  [TableFields.email]: {
    type: String,
    required: [true, ValidationMsgs.EmailEmpty],
    trim: true,
    unique: true,
    lowercase: true,
    // validate(value) {
    //   if (!util.isEmail(value)) {
    //     throw new ValidationError(ValidationMsgs.EmailInvalid);
    //   }
    // },
  },
  [TableFields.password]: {
    type: String,
    trim: true,
    required: [true, ValidationMsgs.PasswordEmpty],
  },
});

superAdminSchema.methods.isValidPassword = function (password) {
  const regEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/;
  return regEx.test(password);
};



superAdminSchema.pre("save", async function (next) {
  if (this.isModified(TableFields.password)) {
    this[TableFields.password] = await bcrypt.hash(
      this[TableFields.password],
      8
    ); // 8 = number of rounds of encryption
  }
  next();
});

superAdminSchema.methods.isValidAuth = async function (password) {
  return await bcrypt.compare(password, this.password);
};

superAdminSchema.methods.createAuthToken = function (superAdmin) {
  const token = jwt.sign(
    {
      [TableFields.email]: superAdmin[TableFields.email],
      superAdminId: superAdmin[TableFields.ID],
      // [TableFields.email]: this[TableFields.email],
      // superAdminId:
    },
    process.env.JWT_ADMIN_PK,
    { expiresIn: "5h" }
  );

  return token;
};

module.exports = mongoose.model("SuperAdmin", superAdminSchema);
