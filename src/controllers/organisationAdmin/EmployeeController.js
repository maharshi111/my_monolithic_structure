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
const DepartmentService = require("../../db/services/DepartmentService");
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
    let existingEmail = await EmployeeService.findEmpByEmail(reqBody[TableFields.email].trim().toLowerCase()).withBasicInfoEmp().execute();

    if(existingEmail){
        throw new ValidationError(ValidationMsgs.EmailAlreadyExists);
    }

    let existingWorkEmail = await EmployeeService.findEmpByWorkEmail(reqBody[TableFields.workEmail].trim().toLowerCase()).withBasicInfoEmp().execute();

    if(existingWorkEmail){
        throw new ValidationError(ValidationMsgs.WorkEmailAlreadyExists);
    }
    let existingPhone = await EmployeeService.findEmpByPhone(reqBody[TableFields.phone].trim()).withBasicInfoEmp().execute();
    if(existingPhone){
        throw new ValidationError(ValidationMsgs.PhoneAlreadyExists);
    }
 
    let empArr = await EmployeeService.findEmpByOrgId(orgId).withBasicInfoEmp().execute();
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
        let departmentNameArr = await DepartmentService.findDepByOrgId(orgId).withBasicInfoDep().execute();
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
    
  await  EmployeeService.addEmployee(empObject);
  await emailUtil.addEmployeeEmail(empObject[TableFields.email],empObject[TableFields.password],empObject[TableFields.workEmail]);

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
    let departmentNameArr =await DepartmentService.findDepByOrgId(orgId).withBasicInfoDep().execute();
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
    let employee = await EmployeeService.findEmpById(reqBody[TableFields.empId]).withBasicInfoEmp().execute();
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
    await EmployeeService.editEmployee(empObject,reqBody[TableFields.empId]);
    if(bool){
        emailUtil.addEmployeeEmail(empObject[TableFields.email],empObject[TableFields.password], empObject[TableFields.workEmail])
    }
}

exports.postDeleteEmployee = async(req,res,next) =>{
    const empId = req.params[TableFields.ID];
    if(!MongoUtil.isValidObjectID(empId) ){
        throw new ValidationError(ValidationMsgs.IdEmpty);
    }
    await EmployeeService.deleteEmployee(empId);
}