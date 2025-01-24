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
    
    const orgId = new mongoose.Types.ObjectId(req.orgId);
   
    
    if(!reqBody[TableFields.firstName].trim()){
        throw new ValidationError(ValidationMsgs.FirstNameEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.firstName],35,0,'first name').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.firstName],35,0,'first name').message);
    }
    if(!reqBody[TableFields.lastName].trim()){
        throw new ValidationError(ValidationMsgs.LastNameEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.lastName],35,0,'last name').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.lastName],35,0,'last name').message);
    }
    if(!reqBody[TableFields.email].trim()){
        throw new ValidationError(ValidationMsgs.EmailEmpty);
    }
    if(!Util.isEmail(reqBody[TableFields.email].trim().toLowerCase())){
        throw new ValidationError(ValidationMsgs.EmailInvalid);
    }
    if(reqBody[TableFields.email].trim().toLowerCase().length>30){
        throw new ValidationError(ValidationMsgs.EmailLength);
    }
    if(!reqBody[TableFields.workEmail].trim().toLowerCase()){
        throw new ValidationError(ValidationMsgs.EmailEmpty);
    }
    if(!Util.isEmail(reqBody[TableFields.workEmail].trim().toLowerCase())){
        throw new ValidationError(ValidationMsgs.EmailInvalid);
    }
    if(reqBody[TableFields.workEmail].trim().toLowerCase().length>30){
        throw new ValidationError(ValidationMsgs.EmailLength);
    }
    if(!reqBody[TableFields.password].trim()){
        throw new ValidationError(ValidationMsgs.PasswordEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.password],15,5,'password').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.password],15,5,'password').message);
    }
    if(!Util.isAlphaNumeric(reqBody[TableFields.password].trim())){
        throw new ValidationError(ValidationMsgs.IsAlphaNumericPassword)
    }
    if(!reqBody[TableFields.address].trim()){
        throw new ValidationError(ValidationMsgs.AddressEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.address],200,0,'address').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.address],200,0,'address').message);
    }
    if(!reqBody[TableFields.role].trim()){
        throw new ValidationError(ValidationMsgs.RoleEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.role],30,0,'role').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.role],30,0,'role').message);
    }
    if(!reqBody[TableFields.phone].trim()){
        throw new ValidationError(ValidationMsgs.PhoneEmpty);
    }
    if(!Util.isDigit(reqBody[TableFields.phone].trim())){
        throw new ValidationError(ValidationMsgs.NumericInvalid);
    }
    if(reqBody[TableFields.phone].trim().length>10 || reqBody[TableFields.phone].trim().length<10){
        throw new ValidationError(ValidationMsgs.PhoneInvalid);
    }
    if(!reqBody[TableFields.dateOfBirth].trim()){
        throw new ValidationError(ValidationMsgs.DateEmpty);
    }
   
    if(!Util.isDate(reqBody[TableFields.dateOfBirth].trim())){
        throw new ValidationError(ValidationMsgs.DateInvalid);
    }
    if(!Util.DateOfBirthInvalid(reqBody[TableFields.dateOfBirth].trim()).success){
        throw new ValidationError(Util.DateOfBirthInvalid(reqBody[TableFields.dateOfBirth]).msg);    
    }
    if(!reqBody[TableFields.basicSalary].trim()){
        throw new ValidationError(ValidationMsgs.SalaryEmpty);
    }
    if(!Util.isDigit(reqBody[TableFields.basicSalary].trim())){
        throw new ValidationError(ValidationMsgs.NumericInvalid);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.basicSalary],10,0,'basic salary').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.basicSalary],10,0,'basic salary').message)
    }
    if(!reqBody[TableFields.joiningDate].trim()){
        throw new ValidationError(ValidationMsgs.DateEmpty);
    }
    if(!Util.isDate(reqBody[TableFields.joiningDate].trim())){
        throw new ValidationError(ValidationMsgs.DateInvalid);
    }
    if(!Util.joiningDateInvalid(reqBody[TableFields.joiningDate].trim()).success){
        throw new ValidationError(Util.joiningDateInvalid(reqBody[TableFields.joiningDate]).msg);
    }
    if(!reqBody[TableFields.depName].trim()){
        throw new ValidationError(ValidationMsgs.DepNameEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.depName],30,0,'department name').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.depName],30,0,'department name').message);
    }

    //index validation
    let existingEmail = await OrganisationAdminService.findEmpByEmail(reqBody[TableFields.email].trim().toLowerCase()).withBasicInfoEmp().execute();

    if(existingEmail){
        throw new ValidationError(ValidationMsgs.EmailAlreadyExists);
    }

    let existingWorkEmail = await OrganisationAdminService.findEmpByWorkEmail(reqBody[TableFields.workEmail].trim().toLowerCase()).withBasicInfoEmp().execute();

    if(existingWorkEmail){
        throw new ValidationError(ValidationMsgs.WorkEmailAlreadyExists);
    }
    let existingPhone = await OrganisationAdminService.findEmpByPhone(reqBody[TableFields.phone].trim()).withBasicInfoEmp().execute();
    if(existingPhone){
        throw new ValidationError(ValidationMsgs.PhoneAlreadyExists);
    }
 
    let empArr = await OrganisationAdminService.findEmpByOrgId(orgId).withBasicInfoEmp().execute();
    console.log(empArr);
    let empObject;
    console.log('empArr.length',empArr.length);
    
    if(empArr.length === 0){
        console.log('$$$$$$$');
        
        empObject ={
            [TableFields.firstName]:reqBody[TableFields.firstName].trim().toUpperCase(),
            [TableFields.lastName]:reqBody[TableFields.lastName].trim().toUpperCase(),
            [TableFields.email]:reqBody[TableFields.email].trim().toLowerCase(),
            [TableFields.workEmail]:reqBody[TableFields.workEmail].trim().toLowerCase(),
            [TableFields.password]:reqBody[TableFields.password].trim(),
            [TableFields.phone]:reqBody[TableFields.phone].trim(),
            [TableFields.address]:reqBody[TableFields.address].trim(),
            [TableFields.dateOfBirth]:reqBody[TableFields.dateOfBirth].trim(),
            [TableFields.basicSalary]:reqBody[TableFields.basicSalary].trim(),
            [TableFields.joiningDate]:reqBody[TableFields.joiningDate].trim(),
            [TableFields.role]: reqBody[TableFields.role].trim(),
            [TableFields.department]:{
                [TableFields.name_]: reqBody[TableFields.depName].trim().toUpperCase(),
                
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
            if(dep[TableFields.departmentName] === reqBody[TableFields.depName].trim().toUpperCase()){
                flag = true;
                depId = dep[TableFields.ID];
            }
        }
        if(flag === false){
            throw new ValidationError(ValidationMsgs.DepartmentNotExists);      
        } 
        empObject = {
            [TableFields.firstName]:reqBody[TableFields.firstName].trim().toUpperCase(),
            [TableFields.lastName]:reqBody[TableFields.lastName].trim().toUpperCase(),
            [TableFields.email]:reqBody[TableFields.email].trim().toLowerCase(),
            [TableFields.workEmail]:reqBody[TableFields.workEmail].trim().toLowerCase(),
            [TableFields.password]:reqBody[TableFields.password].trim(),
            [TableFields.phone]:reqBody[TableFields.phone].trim(),
            [TableFields.address]:reqBody[TableFields.address].trim(),
            [TableFields.dateOfBirth]:reqBody[TableFields.dateOfBirth].trim(),
            [TableFields.basicSalary]:reqBody[TableFields.basicSalary].trim(),
            [TableFields.joiningDate]:reqBody[TableFields.joiningDate].trim(),
            [TableFields.role]: reqBody[TableFields.role].trim(),
            [TableFields.department]:{
                [TableFields.name_]: reqBody[TableFields.depName].trim().toUpperCase(),
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
    if(!reqBody[TableFields.depName].trim()){
        throw new ValidationError(ValidationMsgs.DepNameEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.depName],30,0,'department name').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.depName],30,0,'department name').message);
    }
    if(!reqBody[TableFields.managerName].trim()){
        throw new ValidationError(ValidationMsgs.ManagerNameEmpty); 
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.managerName],71,0,'manager name').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.managerName],71,0,'department name').message);
    }
    if(!reqBody[TableFields.email].trim()){
        throw new ValidationError(ValidationMsgs.EmailEmpty);
    }
    if(!Util.isEmail(reqBody[TableFields.email].trim().toLowerCase())){
        throw new ValidationError(ValidationMsgs.EmailInvalid);
    }
    if(reqBody[TableFields.email].trim().length>30){
        throw new ValidationError(ValidationMsgs.EmailLength);
    }
    let emp = await OrganisationAdminService.findEmpByWorkEmail(reqBody[TableFields.email].trim().toLowerCase()).withNameInfoEmp().execute();
    if(!emp){
        throw new ValidationError(ValidationMsgs.WorkEmailNotExists);
    }
    console.log('emp:',emp);
    
    let fullName = reqBody[TableFields.managerName].trim();
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
        [TableFields.departmentName]:reqBody[TableFields.depName].trim().toUpperCase(),
        [TableFields.manager]:{
            [TableFields.reference]:empId,
            [TableFields.name_]:mName.trim(),
            [TableFields.email]:reqBody[TableFields.email].trim().toLowerCase()
        },
        [TableFields.organisationId]:orgId
    };
    await OrganisationAdminService.addDepartment(depObject)
}


exports.postEditDepartment = async(req,res,next) =>{
    const reqBody = req.body;
    if(!reqBody[TableFields.depName].trim().toUpperCase()){
        throw new ValidationError(ValidationMsgs.DepNameEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.depName],30,0,'department name').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.depName],30,0,'department name').message);
    }
    if(!reqBody[TableFields.managerName].trim().toUpperCase()){
        throw new ValidationError(ValidationMsgs.ManagerNameEmpty); 
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.managerName],71,0,'manager name').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.managerName],71,0,'department name').message);
    }
    if(!reqBody[TableFields.email].trim().toLowerCase()){
        throw new ValidationError(ValidationMsgs.EmailEmpty);
    }
    if(!Util.isEmail(reqBody[TableFields.email].trim().toLowerCase())){
        throw new ValidationError(ValidationMsgs.EmailInvalid);
    }
    if(reqBody[TableFields.email].trim().length>30){
        throw new ValidationError(ValidationMsgs.EmailLength);
    }
    if(!reqBody[TableFields.depId]){
        throw new ValidationError(ValidationMsgs.DepartmentNotExists);
    }
    let emp = await OrganisationAdminService.findEmpByWorkEmail(reqBody[TableFields.email].trim().toLowerCase()).withNameInfoEmp().execute();
    if(!emp){
        throw new ValidationError(ValidationMsgs.WorkEmailNotExists);
    }
    console.log('emp:',emp);
    
    let fullName = reqBody[TableFields.managerName].trim();
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
        [TableFields.departmentName]:reqBody[TableFields.depName].trim().toUpperCase(),
        [TableFields.manager]:{
            [TableFields.reference]:empId,
            [TableFields.name_]:mName.trim(),
            [TableFields.email]:reqBody[TableFields.email].trim().toLowerCase()
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
   if(!Util.isDate(reqBody[TableFields.dateGranted]).trim()){
    throw new ValidationError(ValidationMsgs.DateInvalid); 
   }
   if(!Util.dateGrantedInvalid(reqBody[TableFields.dateGranted].trim()).success){
    throw new ValidationError(Util.dateGrantedInvalid(reqBody[TableFields.dateGranted]).msg);
   }
   if(!MongoUtil.isValidObjectID(empId)){
    throw new ValidationError(ValidationMsgs.IdEmpty) ;
   }
   //let empObj= await OrganisationAdminService.findEmpById(empId).withBasicInfoDep().execute();
   await OrganisationAdminService.addBonus(empId,reqBody[TableFields.bonusType].trim(),reqBody[TableFields.bonusAmount].trim(),reqBody[TableFields.dateGranted].trim());
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

exports.postEditEmployee = async(req,res,next)=>{
    const reqBody = req.body;
    
    const orgId = new mongoose.Types.ObjectId(req.orgId);
   
    
    if(!reqBody[TableFields.firstName]){
        throw new ValidationError(ValidationMsgs.FirstNameEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.firstName],35,0,'first name').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.firstName],35,0,'first name').message);
    }
    if(!reqBody[TableFields.lastName]){
        throw new ValidationError(ValidationMsgs.LastNameEmpty);
    }
    if(!Util.ValidationMsgsLength(reqBody[TableFields.lastName],35,0,'last name').flag){
        throw new ValidationError(Util.ValidationMsgsLength(reqBody[TableFields.lastName],35,0,'last name').message);
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
        throw new ValidationError(ValidationMsgs.PhoneInvalid);
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
    let departmentNameArr =await OrganisationAdminService.findDepByOrgId(orgId).withBasicInfoDep().execute();
    let flag = false;
    for(let dep of departmentNameArr ){
        
        if(dep[TableFields.departmentName] === reqBody[TableFields.depName].toUpperCase()){
            flag = true
        }
    }
    if(flag === false){
        throw new ValidationError(ValidationMsgs.DepartmentNotExists);      
    }
    if(!MongoUtil.isValidObjectID(reqBody[TableFields.empId])){
        throw new ValidationError(ValidationMsgs.IdEmpty);
    }
    let depId;
    let employee = await OrganisationAdminService.findEmpById(reqBody[TableFields.empId]).withBasicInfoEmp().execute();
    for(let dep of departmentNameArr ){
        if(dep[TableFields.departmentName] === reqBody[TableFields.depName].toUpperCase()){
            console.log('##2');
            
            depId = dep[TableFields.ID];
        }
    };
    let bool = false;
    if(employee[TableFields.personalEmail] !== reqBody[TableFields.personalEmail] || employee[TableFields.password] !== reqBody[TableFields.password] || employee[TableFields.workEmail] !== reqBody[TableFields.workEmail]){
        bool = true;
    }
    let empObject ={
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
    await OrganisationAdminService.editEmployee(bool,empObject,reqBody[TableFields.empId]);
}

exports.postDeleteEmployee = async(req,res,next) =>{
    const empId = req.params[TableFields.ID];
    if(!MongoUtil.isValidObjectID(empId) ){
        throw new ValidationError(ValidationMsgs.IdEmpty);
    }
    await OrganisationAdminService.deleteEmployee(empId);

}