const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require("validator");
const {ValidationMsgs, TableNames, TableFields, UserTypes} = require("../../utils/constants");

const employeeSchema = new Schema({
    [TableFields.firstName]:{
        type:String,
        required: [true, ValidationMsgs.FirstNameEmpty]
    },
    [TableFields.lastName]:{
        type:String,
        required: [true, ValidationMsgs.LastNameEmpty]
    },
    [TableFields.email]:{
        type:String,
         trim: true,
        lowercase: true,
        validate(value) {
        if (!validator.isEmail(value)) {
            throw new ValidationError(ValidationMsgs.EmailInvalid);
        }
        },
        required: [true, ValidationMsgs.EmailEmpty]
    },
    [TableFields.workEmail]:{
        type:String,
        trim: true,
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
    },
    [TableFields.phone]:{
        type:Number,
        validate(value) {
                if (!validator.isNumeric(value)) {
                  throw new ValidationError(ValidationMsgs.NumericInvalid);
                }
                if(value.length()!=10){
                    throw new ValidationError(ValidationMsgs.PhoneInvalid);
                }
            },
        required: [true, ValidationMsgs.PhoneEmpty]   
    },
    [TableFields.address]:{
        type:String,
        required:[true, ValidationMsgs.AddressEmpty]  
    },
    [TableFields.dateOfBirth]:{
        type: Date,
         validate(value) {
              if (!validator.isDate(value)) {
                throw new ValidationError(ValidationMsgs.DateInvalid);
              }
            },
            required: [true, ValidationMsgs.DateEmpty]
    },
    [TableFields.basicSalary]:{
        type:Number,
        validate(value) {
            if (!validator.isNumeric(value)) {
              throw new ValidationError(ValidationMsgs.NumericInvalid);
            }
        },
        required: [true, ValidationMsgs.SalaryEmpty]  
    },
    [TableFields.bonuses]:[{
        // BonusType: {type:String, required: true},
        // BonusAmount:{type:Number, required: true }
        [TableFields.bonusType]: {type:String},
        [TableFields.bonusAmount]:{
            type:Number,
            validate(value) {
                if (!validator.isNumeric(value)) {
                  throw new ValidationError(ValidationMsgs.NumericInvalid);
                }
            }
        },
        [TableFields.dateGranted]:{
            type: Date,
            validate(value) {
                if (!validator.isDate(value)) {
                  throw new ValidationError(ValidationMsgs.DateInvalid);
                }
              }
        }
    }
    ],

    [TableFields.joiningDate]:  {
        type: Date,
        validate(value) {
            if (!validator.isDate(value)) {
              throw new ValidationError(ValidationMsgs.DateInvalid);
            }
          },
        required: [true, ValidationMsgs.DateEmpty]    
    },
    [TableFields.department]:{
        [TableFields.reference]:{ 
            type:Schema.Types.ObjectId, 
            // required:true,
            ref:'Department'
       },
       [TableFields.name]:{
            type:String,
            required: [true, ValidationMsgs.DepNameEmpty]    
       }
    },
    [TableFields.role]:{
        type:String,
        required:[true, ValidationMsgs.RoleEmpty]
    },
    [TableFields.organisationId]:{
        type:Schema.Types.ObjectId,
        ref:'Organisation',
        required:[true, ValidationMsgs.OrganisationIdEmpty]
    }






    

    
})
module.exports = mongoose.model('Employee',employeeSchema);