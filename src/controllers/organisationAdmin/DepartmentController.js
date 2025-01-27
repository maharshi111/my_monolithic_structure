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
const DepartmentService = require('../../db/services/DepartmentService');
var mongoose = require('mongoose');
const { MongoUtil } = require("../../db/mongoose");



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
    let emp = await EmployeeService.findEmpByWorkEmail(reqBody[TableFields.email].trim().toLowerCase()).withNameInfoEmp().execute();
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
    await DepartmentService.addDepartment(depObject)
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
    let emp = await EmployeeService.findEmpByWorkEmail(reqBody[TableFields.email].trim().toLowerCase()).withNameInfoEmp().execute();
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
   
    await DepartmentService.editDepartment(reqBody[TableFields.depId],depObject);
     
}


exports.postDeleteDepartment = async(req,res,next) =>{
    const depId =( req.params[TableFields.ID]);

    if(!MongoUtil.isValidObjectID(depId) ){
        throw new ValidationError(ValidationMsgs.IdEmpty);
    }

    await DepartmentService.deleteDepartmentById(depId);
}


