const mongoose = require('mongoose');
const validator = require("validator");
const Schema = mongoose.Schema;
const {ValidationMsgs, TableNames, TableFields, UserTypes} = require("../../utils/constants");
const superAdminSchema = new Schema({
   
    [TableFields.name]:{
        type:String,
        trim: true,
        required: [true, ValidationMsgs.UserNameEmpty]
    },
    [TableFields.email]:{
        type:String,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new ValidationError(ValidationMsgs.EmailInvalid);
            }
        },
        required: [true, ValidationMsgs.EmailEmpty]
    },
    [TableFields.password]:{
        type:String,
        trim: true,
        required: [true, ValidationMsgs.PasswordEmpty] 
    }

});
module.exports = mongoose.model('SuperAdmin',superAdminSchema);