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
  [TableFields.password]: {
    type: String,
    trim: true,
    required: [true, ValidationMsgs.PasswordEmpty],
  },
  [TableFields.tokens]: [
    {
      _id: false,
      [TableFields.token]: {
        type: String,
      },
    },
  ]
},
  {
            timestamps: true,
            toJSON: {
                transform: function (doc, ret) {
                    delete ret[TableFields.tokens];
                    delete ret[TableFields.password];
                    delete ret.createdAt;
                    delete ret.updatedAt;
                    delete ret.__v;
                },
            },
  }
);

superAdminSchema.methods.isValidPassword = function (password) {
  const regEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/;
    //console.log(regEx.test(password));
    
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
    // console.log('inside isValidAuth');
    // console.log('pass',password);
    // console.log(this);
    
    // console.log('this.pass',this.password);
    // let bool = await bcrypt.compare(password, this.password);
    // console.log('value of bool is ',bool);
    
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

module.exports = mongoose.model(TableNames.SuperAdmin, superAdminSchema);
