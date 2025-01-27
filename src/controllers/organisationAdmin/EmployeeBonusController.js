const {
    TableFields,
    ValidationMsgs,
    InterfaceTypes,
} = require("../../utils/constants");
const ValidationError = require("../../utils/ValidationError");
const SuperAdminService = require("../../db/services/SuperAdminServices");
const emailUtil = require("../../utils/email");
const Util = require("../../utils/util");
const EmployeeService = require("../../db/services/EmployeeService");
var mongoose = require('mongoose');
const { MongoUtil } = require("../../db/mongoose");




exports.postAddBonus = async(req,res,next) =>{
    const reqBody = req.body;
    const empId = req.params[TableFields.ID];
    if(!reqBody[TableFields.bonusType].trim()){
     throw new ValidationError(ValidationMsgs.BonusTypeEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.bonusType],30,0,'bonus type').flag){
         throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.bonusType],30,0,'bonus type').message);
    }
    if(!reqBody[TableFields.bonusAmount].trim()){
     throw new ValidationError(ValidationMsgs.BonusAmountEmpty);
    }
    if(!Util.isDigit(reqBody[TableFields.bonusAmount].trim())){
     throw new ValidationError(ValidationMsgs.NumericInvalid)
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.bonusAmount],7,0,'bonus amount').flag){
     throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.bonusAmount],7,0,'bonus amount').message);
    }
    if(!reqBody[TableFields.dateGranted].trim()){
     throw new ValidationError(ValidationMsgs.DateEmpty);
    }
    if(!Util.isDate(reqBody[TableFields.dateGranted].trim())){
     throw new ValidationError(ValidationMsgs.DateInvalid); 
    }
    if(!Util.dateGrantedInvalid(reqBody[TableFields.dateGranted].trim()).success){
     throw new ValidationError(Util.dateGrantedInvalid(reqBody[TableFields.dateGranted]).msg);
    }
    if(!MongoUtil.isValidObjectID(empId)){
     throw new ValidationError(ValidationMsgs.IdEmpty) ;
    }
    await EmployeeService.addBonus(empId,reqBody[TableFields.bonusType].trim(),reqBody[TableFields.bonusAmount].trim(),reqBody[TableFields.dateGranted].trim());
 }
 
 exports.postUpdateBonus = async(req,res,next) => {
         const reqBody = req.body;
         const bonusId = req.params[TableFields.ID];
 
        if(!reqBody[TableFields.bonusType]){
         throw new ValidationError(ValidationMsgs.BonusTypeEmpty);
        }
        if(!Util.ValidationMsgsLength(reqBody[TableFields.bonusType],30,0,'bonus type').flag){
             throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.bonusType],30,0,'bonus type').message);
        }
        if(!reqBody[TableFields.bonusAmount]){
         throw new ValidationError(ValidationMsgs.BonusAmountEmpty);
        }
        if(!Util.isDigit(reqBody[TableFields.bonusAmount])){
         throw new ValidationError(ValidationMsgs.NumericInvalid)
        }
        if(!Util.ValidationMsgsLength(reqBody[TableFields.bonusAmount],7,0,'bonus amount').flag){
         throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.bonusAmount],7,0,'bonus amount').message);
        }
        if(!reqBody[TableFields.dateGranted]){
         throw new ValidationError(ValidationMsgs.DateEmpty);
        }
        if(!Util.isDate(reqBody[TableFields.dateGranted])){
         throw new ValidationError(ValidationMsgs.DateInvalid); 
        }
        if(!Util.dateGrantedInvalid(reqBody[TableFields.dateGranted]).success){
         throw new ValidationError(Util.dateGrantedInvalid(reqBody[TableFields.dateGranted]).msg);
        }
        if(!MongoUtil.isValidObjectID(reqBody[TableFields.empId])){
         throw new ValidationError(ValidationMsgs.IdEmpty) ;
        }
        if(!MongoUtil.isValidObjectID(bonusId)){
         throw new ValidationError(ValidationMsgs.IdEmpty) ;
        }
       
        let obj = {
            [TableFields.bonusType] : reqBody[TableFields.bonusType],
            [TableFields.bonusAmount] : reqBody[TableFields.bonusAmount],
           [TableFields.dateGranted]  : reqBody[TableFields.dateGranted],
        }
        
        await EmployeeService.updateBonus(bonusId,reqBody[TableFields.empId],obj);
 
 }
 
 
 exports.postDeleteBonus = async(req,res,next) =>{
 console.log(req.params.idString);
 console.log(req.params);
 
 const str =  req.params[TableFields.idString];
 let arr = str.split('+');
 const bonusId = arr[0];
 const empId = arr[1];
 await EmployeeService.deleteBonus(empId,bonusId);
 }