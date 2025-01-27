const {
    TableFields,
    ValidationMsgs,
    UserTypes,
    TableNames,
  } = require("../../utils/constants");
const Util = require("../../utils/util");
const ValidationError = require("../../utils/ValidationError");
const SuperAdmin = require("../models/superAdmin");
const Organisation = require("../models/organisation");
const Employee = require('../models/employee');
const Department = require('../models/department');
const emailUtil = require("../../utils/email");
const employee = require("../models/employee");

class DepartmentService{

static findDepByOrgId = (orgId) =>{
    return new ProjectionBuilder(async function () {
        return await Department.find({[`${TableFields.organisationId}`]:orgId},this);
     })  
}

static addDepartment = async(depObj) =>{
    if(!depObj[TableFields.manager][TableFields.email]){
        throw new ValidationError(ValidationMsgs.EmailEmpty);           
    }
    const department = new Department(depObj);
    const error = department.validateSync();
    if (error) throw error;
    await department.save();
}

static editDepartment = async(depId,depObj) =>{
    if(!depObj[TableFields.manager][TableFields.email]){
        throw new ValidationError(ValidationMsgs.EmailEmpty);           
    }
    // console.log('--->',depId);
    
    // let obj = {...depObj};
    // console.log('===>',depObj);
    //let currentDep = await Department.findById(depId);
    // console.log(currentDep);
    
//    let oldDep =  await Department.findById(depId);
//    oldDep[TableFields.departmentName] = depObj[TableFields.departmentName];
//    oldDep[TableFields.manager][TableFields.name_] = depObj[TableFields.manager][TableFields.name_];
//    oldDep[TableFields.manager][TableFields.email] = depObj[TableFields.manager][TableFields.email];
//    oldDep[TableFields.manager][TableFields.reference] = depObj[TableFields.manager][TableFields.reference];
let newDep =  await Department.findByIdAndUpdate({[TableFields.ID]:depId},
    {
        // [TableFields.departmentName] : depObj[TableFields.departmentName],
        // [`${TableFields.manager}.${TableFields.name_}`] : depObj[TableFields.manager][TableFields.name_],
        // [`${TableFields.manager}.${TableFields.email}`]:[TableFields.manager][TableFields.email],
        // [`${TableFields.manager}.${TableFields.reference}`]:[TableFields.manager][TableFields.reference]
        $set:{...depObj}
    }
);
console.log('---->>>',newDep);


//    await oldDep.save();
}



static deleteDepartmentById = async(depId) =>{
    console.log('11',depId);
    
   // await Department.findById(depId);
    await Department.findByIdAndDelete(depId);    
}


}

const ProjectionBuilder = class {
    constructor(methodToExecute) {
        const projection = {};
        this.withBasicInfoOrg = () => {
            projection[TableFields.orgName] = 1;
            projection[TableFields.ID] = 1;
            projection [TableFields.orgCEO] = 1;
            projection [TableFields.uniqueId] = 1;
            return this;
        };
        this.withUniqueId = () =>{
            projection[TableFields.uniqueId] =1;
            return this;
        };
        this.withTokenInfo =() =>{
            projection[TableFields.orgName] = 1;
            projection[TableFields.ID] = 1;
            projection[TableFields.orgCEO]=1;
            return this;
        };
        this.withBasicInfoEmp = () =>{
            projection[TableFields.organisationId]=1;
            projection[TableFields.ID]=1;
            projection[TableFields.email]=1;
            projection[TableFields.bonuses]=1;
            return this;
        }
        this.withNameInfoEmp = () =>{
            projection[TableFields.firstName] = 1;
            projection[TableFields.lastName] =1;
            projection[TableFields.ID]=1;
            return this;
        }

        this.withBasicInfoDep = () =>{
            projection[TableFields.departmentName]=1;
            projection[TableFields.organisationId] = 1;
            projection[TableFields.ID]=1;
            return this;
        }
        // this.withUserType = () => {
        //     projection[TableFields.userType] = 1;
        //     return this;
        // };
        // this.withId = () => {
        //     projection[TableFields.ID] = 1;
        //     return this;
        // };
        // this.withApproved = () => {
        //     projection[TableFields.approved] = 1;
        //     return this;
        // };
        // this.withName = () => {
        //     projection[TableFields.name_] = 1;
        //     return this;
        // };
        // this.withPasswordResetToken = () => {
        //     projection[TableFields.passwordResetToken] = 1;
        //     return this;
        // };

        this.execute = async () => {
            return await methodToExecute.call(projection);
        };
    }
};

module.exports = DepartmentService;