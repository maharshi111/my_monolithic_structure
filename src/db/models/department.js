const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require("validator");
const {ValidationMsgs, TableNames, TableFields, UserTypes} = require("../../utils/constants");

const departmentSchema = new Schema({
    [TableFields.departmentName]:{
        type:String,
        required: true
   } ,
   [TableFields.manager]:{
    [TableFields.reference]:{
               type:Schema.Types.ObjectId, 
               required:true, 
               ref:'Employee'
             },
    [TableFields.name]:{ type:String,required: true},
    [TableFields.email]:{type:String,required: true}
   },
   [TableFields.organisationId]:{
     type:Schema.Types.ObjectId,
     ref:'Organisation',
     required:true
   }


});
module.exports = mongoose.model('Department',departmentSchema);