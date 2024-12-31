const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require("validator");
const {ValidationMsgs, TableNames, TableFields, UserTypes} = require("../../utils/constants");

const employeeSchema = new Schema({
    [TableFields.firstName]:{
        type:String,
        required: true
    },
    [TableFields.lastName]:{
        type:String,
        required: true
    },
    [TableFields.email]:{
        type:String,
        required: true
    },
    [TableFields.workEmail]:{
        type:String,
        required: true  
    },
    [TableFields.password]:{
        type:String,
        required: true 
    },
    [TableFields.phone]:{
        type:Number,
        required: true  
    },
    [TableFields.address]:{
        type:String,
        required: true 
    },
    [TableFields.dateOfBirth]:{
        type: Date,
        required: true  
    },
    [TableFields.basicSalary]:{
        type:Number,
        required: true  
    },
    [TableFields.bonuses]:[{
        // BonusType: {type:String, required: true},
        // BonusAmount:{type:Number, required: true }
        [TableFields.bonusType]: {type:String},
        [TableFields.bonusAmount]:{type:Number},
        [TableFields.dateGranted]:{type: Date}
    }
    ],

    [TableFields.joiningDate]:  {
        type: Date,
        required: true    
    },
    [TableFields.department]:{
        [TableFields.reference]:{ 
            type:Schema.Types.ObjectId, 
            // required:true,
            ref:'Department'
       },
       [TableFields.name]:{
            type:String,
             required: true 
       }
    },
    [TableFields.role]:{
        type:String,
        required:true
    },
    [TableFields.organisationId]:{
        type:Schema.Types.ObjectId,
        ref:'Organisation',
        required:true
    }






    

    
})
module.exports = mongoose.model('Employee',employeeSchema);