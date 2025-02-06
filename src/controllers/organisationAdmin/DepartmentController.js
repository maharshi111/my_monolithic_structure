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



exports.addDepartment = async(req,res,next)=>{
    const reqBody = req.body;
    
    await parseAndValidateDepartment(reqBody,undefined,false,async(updatedFields)=>{
        await DepartmentService.addDepartment(updatedFields)
    },req) ;
   
}

exports.editDepartment = async(req,res,next) =>{
    const reqBody = req.body;
    
    if(!reqBody[TableFields.depId]){
        throw new ValidationError(ValidationMsgs.DepIdEmpty);
    }
    let existingDepartment = await DepartmentService.findDepByDepId(reqBody[TableFields.depId]).execute();
    if(!existingDepartment){
        throw new ValidationError(ValidationMsgs.RecordNotFound);
    }
    await parseAndValidateDepartment(reqBody,existingDepartment,true,async(updatedFields)=>{
        await DepartmentService.editDepartment(reqBody[TableFields.depId],updatedFields);
    },req)
      
}


exports.deleteDepartment = async(req,res,next) =>{
    const depId =( req.params[TableFields.ID]);

    if(!MongoUtil.isValidObjectID(depId) ){
        throw new ValidationError(ValidationMsgs.IdEmpty);
    }

    await DepartmentService.deleteDepartmentById(depId);
}


async function parseAndValidateDepartment(
    reqBody,
    existingDepartment = {},
    isUpdate = false,
    onValidationCompleted = async () => {},
    req
){
    if(isFieldEmpty(reqBody[TableFields.depName])){
        throw new ValidationError(ValidationMsgs.DepNameEmpty);
    }
    
    if(isFieldEmpty(reqBody[TableFields.managerName])){
        throw new ValidationError(ValidationMsgs.ManagerNameEmpty); 
    }
    
    if(isFieldEmpty(reqBody[TableFields.email])){
        throw new ValidationError(ValidationMsgs.EmailEmpty);
    }
    
    let emp = await EmployeeService.findEmpByWorkEmail(reqBody[TableFields.email].trim().toLowerCase()).withNameInfoEmp().execute();
    if(!emp){
        throw new ValidationError(ValidationMsgs.WorkEmailNotExists);
    }
    try{
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
    await onValidationCompleted(depObject);
    }catch(error){
        throw error;
    }
}

function isFieldEmpty(providedField, existingField) {
    if (providedField != undefined) {
        if (providedField) {
            return false;
        }
    } else if (existingField) {
        return false;
    }
    return true;
}
