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
const { MongoUtil } = require("../../db/mongoose");
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
            if(dep[TableFields.departmentName] === reqBody[TableFields.depName].toUpperCase()){
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

exports.postAddDepartment = async(req,res,next)=>{
    const reqBody = req.body;
    if(!reqBody[TableFields.depName]){
        throw new ValidationError(ValidationMsgs.DepNameEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.depName],30,0,'department name').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.depName],30,0,'department name').message);
    }
    if(!reqBody[TableFields.managerName]){
        throw new ValidationError(ValidationMsgs.ManagerNameEmpty); 
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.managerName],71,0,'manager name').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.managerName],71,0,'department name').message);
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
    let emp = await OrganisationAdminService.findEmpByWorkEmail(reqBody[TableFields.email]).withNameInfoEmp().execute();
    if(!emp){
        throw new ValidationError(ValidationMsgs.WorkEmailNotExists);
    }
    console.log('emp:',emp);
    
    let fullName = reqBody[TableFields.managerName];
    let arr = fullName.split(' ');
    let ln = arr[0].toUpperCase();
    let fn = arr.pop().toUpperCase();
    console.log(fn);
    console.log(ln);
    if(fn!==emp[TableFields.firstName] || ln!==emp[TableFields.lastName]){
        throw new ValidationError(ValidationMsgs.NameAndEmailMistmatch);    
    }
    // emp = await OrganisationAdminService.findEmpByWorkEmail(reqBody[TableFields.email]).withBasicInfoEmp().execute();
    console.log('this is emp',emp);
    
    let mName = ln+' '+fn;
    const empId = new mongoose.Types.ObjectId(emp[TableFields.ID]);
    const orgId = new mongoose.Types.ObjectId(req.orgId);
    let depObject = {
        [TableFields.departmentName]:reqBody[TableFields.depName].toUpperCase(),
        [TableFields.manager]:{
            [TableFields.reference]:empId,
            [TableFields.name_]:mName,
            [TableFields.email]:reqBody[TableFields.email]
        },
        [TableFields.organisationId]:orgId
    };
    await OrganisationAdminService.addDepartment(depObject)
}


exports.postEditDepartment = async(req,res,next) =>{
    const reqBody = req.body;
    if(!reqBody[TableFields.depName]){
        throw new ValidationError(ValidationMsgs.DepNameEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.depName],30,0,'department name').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.depName],30,0,'department name').message);
    }
    if(!reqBody[TableFields.managerName]){
        throw new ValidationError(ValidationMsgs.ManagerNameEmpty); 
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.managerName],71,0,'manager name').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.managerName],71,0,'department name').message);
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
    if(!reqBody[TableFields.depId]){
        throw new ValidationError(ValidationMsgs.DepartmentNotExists);
    }
    let emp = await OrganisationAdminService.findEmpByWorkEmail(reqBody[TableFields.email]).withNameInfoEmp().execute();
    if(!emp){
        throw new ValidationError(ValidationMsgs.WorkEmailNotExists);
    }
    console.log('emp:',emp);
    
    let fullName = reqBody[TableFields.managerName];
    let arr = fullName.split(' ');
    let ln = arr[0].toUpperCase();
    let fn = arr.pop().toUpperCase();
    console.log(fn);
    console.log(ln);
    if(fn!==emp[TableFields.firstName] || ln!==emp[TableFields.lastName]){
        throw new ValidationError(ValidationMsgs.NameAndEmailMistmatch);    
    }
    let mName = ln+' '+fn;
    const empId = new mongoose.Types.ObjectId(emp[TableFields.ID]);
    const orgId = new mongoose.Types.ObjectId(req.orgId);
    let depObject = {
        [TableFields.departmentName]:reqBody[TableFields.depName].toUpperCase(),
        [TableFields.manager]:{
            [TableFields.reference]:empId,
            [TableFields.name_]:mName,
            [TableFields.email]:reqBody[TableFields.email]
        },
        [TableFields.organisationId]:orgId
    };
   
    await OrganisationAdminService.editDepartment(reqBody[TableFields.depId],depObject);
     
}

exports.postDeleteDepartment = async(req,res,next) =>{
    const depId =( req.params[TableFields.ID]);
    // console.log('this is whole req',req.params);
    
    // console.log('this is depId',depId);
    
    if(!MongoUtil.isValidObjectID(depId) ){
        throw new ValidationError(ValidationMsgs.IdEmpty);
    }

    await OrganisationAdminService.deleteDepartmentById(depId);
}

exports.postAddBonus = async(req,res,next) =>{
   const reqBody = req.body;
   const empId = req.params[TableFields.ID];
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
   if(!MongoUtil.isValidObjectID(empId)){
    throw new ValidationError(ValidationMsgs.IdEmpty) ;
   }
   //let empObj= await OrganisationAdminService.findEmpById(empId).withBasicInfoDep().execute();
   await OrganisationAdminService.addBonus(empId,reqBody[TableFields.bonusType],reqBody[TableFields.bonusAmount],reqBody[TableFields.dateGranted]);
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
       await OrganisationAdminService.updateBonus(bonusId,reqBody[TableFields.bonusType],reqBody[TableFields.bonusAmount],reqBody[TableFields.dateGranted],reqBody[TableFields.empId]);

}


exports.postDeleteBonus = async(req,res,next) =>{
console.log(req.params.idString);
console.log(req.params);

const str =  req.params[TableFields.idString];
let arr = str.split('+');
const bonusId = arr[0];
const empId = arr[1];
await OrganisationAdminService.deleteBonus(empId,bonusId);
}