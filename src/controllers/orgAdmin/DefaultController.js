const {
    TableFields,
    ValidationMsgs,
    InterfaceTypes,
} = require("../../utils/constants");
const ValidationError = require("../../utils/ValidationError");
const SuperAdminService = require("../../db/services/SuperAdminServices");
const emailUtil = require("../../utils/email");
const Util = require("../../utils/util");
const OrganisationAdminService = require("../../db/services/orgAdminService");
var mongoose = require('mongoose');
exports.postAddEmployee =async(req,res,next) =>{
    const reqBody = req.body;
    console.log('###');
    
    const orgId = new mongoose.Types.ObjectId(req.orgId);
    console.log('orgId',orgId);
    console.log(reqBody[TableFields.email].length);
    console.log(reqBody[TableFields.workEmail].length);
    console.log(reqBody[TableFields.phone].length);
    
    if(!reqBody[TableFields.firstName]){
        throw new ValidationError(ValidationMsgs.FirstNameEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.firstName],35,0,'first name').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.firstName],35,0,'first name').message);
    }
    if(!reqBody[TableFields.email]){
        throw new ValidationError(ValidationMsgs.EmailEmpty);
    }
    if(!Util.isEmail(reqBody[TableFields.email])){
        throw new ValidationError(ValidationMsgs.EmailInvalid);
    }
    if(reqBody[TableFields.email].length>30){
        throw new ValidationError(ValidationMsgs.EmailLength);
    }
    if(!reqBody[TableFields.workEmail]){
        throw new ValidationError(ValidationMsgs.EmailEmpty);
    }
    if(!Util.isEmail(reqBody[TableFields.workEmail])){
        throw new ValidationError(ValidationMsgs.EmailInvalid);
    }
    if(reqBody[TableFields.workEmail].length>30){
        throw new ValidationError(ValidationMsgs.EmailLength);
    }
    if(!reqBody[TableFields.password]){
        throw new ValidationError(ValidationMsgs.PasswordEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.password],15,5,'password').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.password],15,5,'password').message);
    }
    if(!Util.isAlphaNumeric(reqBody[TableFields.password])){
        throw new ValidationError(ValidationMsgs.IsAlphaNumericPassword)
    }
    if(!reqBody[TableFields.address]){
        throw new ValidationError(ValidationMsgs.AddressEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.address],200,0,'address').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.address],200,0,'address').message);
    }
    if(!reqBody[TableFields.role]){
        throw new ValidationError(ValidationMsgs.RoleEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.role],30,0,'role').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.role],30,0,'role').message);
    }
    if(!reqBody[TableFields.phone]){
        throw new ValidationError(ValidationMsgs.PhoneEmpty);
    }
    if(!Util.isDigit(reqBody[TableFields.phone])){
        throw new ValidationError(ValidationMsgs.NumericInvalid);
    }
    if(reqBody[TableFields.phone].length>10 || reqBody[TableFields.phone].length<10){
        throw new ValidationError(ValidationMsgs.PhoneEmpty);
    }
    if(!reqBody[TableFields.dateOfBirth]){
        throw new ValidationError(ValidationMsgs.DateEmpty);
    }
   
    if(!Util.isDate(reqBody[TableFields.dateOfBirth])){
        throw new ValidationError(ValidationMsgs.DateInvalid);
    }
    if(!Util.DateOfBirthInvalid(reqBody[TableFields.dateOfBirth]).success){
        throw new ValidationError(Util.DateOfBirthInvalid(reqBody[TableFields.dateOfBirth]).msg);    
    }
    if(!reqBody[TableFields.basicSalary]){
        throw new ValidationError(ValidationMsgs.SalaryEmpty);
    }
    if(!Util.isDigit(reqBody[TableFields.basicSalary])){
        throw new ValidationError(ValidationMsgs.NumericInvalid);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.basicSalary],10,0,'basic salary').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.basicSalary],10,0,'basic salary').message)
    }
    if(!reqBody[TableFields.joiningDate]){
        throw new ValidationError(ValidationMsgs.DateEmpty);
    }
    if(!Util.isDate(reqBody[TableFields.joiningDate])){
        throw new ValidationError(ValidationMsgs.DateInvalid);
    }
    if(!Util.joiningDateInvalid(reqBody[TableFields.joiningDate]).success){
        throw new ValidationError(Util.joiningDateInvalid(reqBody[TableFields.joiningDate]).msg);
    }
    if(!reqBody[TableFields.depName]){
        throw new ValidationError(ValidationMsgs.DepNameEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.depName],30,0,'department name').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.depName],30,0,'department name').message);
    }
    let empArr = await OrganisationAdminService.findEmpByOrgId(orgId).withBasicInfoEmp().execute();
    console.log(empArr);
    let empObject;
    console.log('empArr.length',empArr.length);
    
    if(empArr.length === 0){
        console.log('$$$$$$$');
        
        empObject ={
            [TableFields.firstName]:reqBody[TableFields.firstName].toUpperCase(),
            [TableFields.lastName]:reqBody[TableFields.lastName].toUpperCase(),
            [TableFields.email]:reqBody[TableFields.email],
            [TableFields.workEmail]:reqBody[TableFields.workEmail],
            [TableFields.password]:reqBody[TableFields.password],
            [TableFields.phone]:reqBody[TableFields.phone],
            [TableFields.address]:reqBody[TableFields.address],
            [TableFields.dateOfBirth]:reqBody[TableFields.dateOfBirth],
            [TableFields.basicSalary]:reqBody[TableFields.basicSalary],
            [TableFields.joiningDate]:reqBody[TableFields.joiningDate],
            [TableFields.role]: reqBody[TableFields.role],
            [TableFields.department]:{
                [TableFields.name_]: reqBody[TableFields.depName].toUpperCase(),
                
            },
            [TableFields.organisationId]:orgId
            
        };

    }
    if(empArr.length!==0){
        let departmentNameArr = await OrganisationAdminService.findDepByOrgId(orgId).withBasicInfoDep().execute();
        console.log(departmentNameArr);
        let flag = false;
        let depId;
        for(let dep of departmentNameArr ){
            if(dep[TableFields.departmentName] === reqBody[TableFields.depName]){
                flag = true;
                depId = dep[TableFields.ID];
            }
        }
        if(flag === false){
            throw new ValidationError(ValidationMsgs.DepartmentNotExists);      
        } 
        empObject = {
            [TableFields.firstName]:reqBody[TableFields.firstName].toUpperCase(),
            [TableFields.lastName]:reqBody[TableFields.lastName].toUpperCase(),
            [TableFields.email]:reqBody[TableFields.email],
            [TableFields.workEmail]:reqBody[TableFields.workEmail],
            [TableFields.password]:reqBody[TableFields.password],
            [TableFields.phone]:reqBody[TableFields.phone],
            [TableFields.address]:reqBody[TableFields.address],
            [TableFields.dateOfBirth]:reqBody[TableFields.dateOfBirth],
            [TableFields.basicSalary]:reqBody[TableFields.basicSalary],
            [TableFields.joiningDate]:reqBody[TableFields.joiningDate],
            [TableFields.role]: reqBody[TableFields.role],
            [TableFields.department]:{
                [TableFields.name_]: reqBody[TableFields.depName].toUpperCase(),
                [TableFields.reference]:depId
            },
            [TableFields.organisationId]:orgId
            
        };       
    }
    console.log('&&&&&&&&&&');
    
  await  OrganisationAdminService.addEmployee(empObject);


}