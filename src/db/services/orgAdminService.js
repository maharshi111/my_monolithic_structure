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

class OrganisationAdminService {
     static findOneOrgByEmail = (ceoEmail)=>{
        return new ProjectionBuilder(async function () {
           return await Organisation.findOne({[`${TableFields.orgCEO}.${TableFields.email}`]:ceoEmail},this);
        })
      }
    static findOneByOrgName = (orgName)=>{
        return new ProjectionBuilder(async function () {
            return await Organisation.findOne({[`${TableFields.orgName}`]:orgName},this);
         })
    }
    static findOrgByEmail = (ceoEmail) =>{
        return new ProjectionBuilder(async function () {
            return await Organisation.find({[`${TableFields.orgCEO}.${TableFields.email}`]:ceoEmail},this);
         })
    }
    static findOrgByUniqueId = (uId) =>{
        return new ProjectionBuilder(async function () {
            return await Organisation.findOne({[`${TableFields.uniqueId}`]:uId},this);
         }) 
    }
    static findEmpByOrgId = (orgId) =>{
        return new ProjectionBuilder(async function () {
            return await Employee.find({[`${TableFields.organisationId}`]:orgId},this);
         }) 
    }

    static findDepByOrgId = (orgId) =>{
        return new ProjectionBuilder(async function () {
            return await Department.find({[`${TableFields.organisationId}`]:orgId},this);
         })  
    }
    
    static findEmpByWorkEmail = (email) =>{
        return new ProjectionBuilder(async function () {
            return await Employee.findOne({[`${TableFields.workEmail}`]:email},this);
         })  
    }
    static findEmpById=(empId)=>{
        return new ProjectionBuilder(async function () {
            return await Employee.findById(empId,this);
         })  
    }
    static saveAuthToken = async (uId, token) => {
        
        
            await Organisation.updateOne(
                {
                    [TableFields.uniqueId]: uId,
                },
                {
                    $push: {
                        [TableFields.tokens]: {[TableFields.token]: token},
                    },
                }
            );
            
            
        };

    static getUserByIdAndToken = (orgId, token, lean = false) => {
            return new ProjectionBuilder(async function () {
                return await Organisation.findOne(
                    {
                        [TableFields.ID]: orgId,
                        [TableFields.tokens + "." + TableFields.token]: token,
                    },
                    this
                ).lean(lean);
            });
        };

    static addEmployee = async(empObject) =>{
        if(!empObject[TableFields.email]){
            throw new ValidationError(ValidationMsgs.EmailEmpty);
        }
        if(!empObject[TableFields.password]){
            throw new ValidationError(ValidationMsgs.PasswordEmpty);
        }
        if(!empObject[TableFields.workEmail]){
            throw new ValidationError(ValidationMsgs.EmailEmpty); 
        }
        let employee = new Employee(empObject);
        console.log('emp:',employee);
        
        await employee.save();
        console.log('***');
        
        await emailUtil.addEmployeeEmail(empObject[TableFields.email],empObject[TableFields.password],empObject[TableFields.workEmail]);
    }

    static addDepartment = async(depObj) =>{
        if(!depObj[TableFields.manager][TableFields.email]){
            throw new ValidationError(ValidationMsgs.EmailEmpty);           
        }
        const department = new Department(depObj);
        await department.save();
    }

    static editDepartment = async(depId,depObj) =>{
       let oldDep =  await Department.findById(depId);
       oldDep[TableFields.departmentName] = depObj[TableFields.departmentName];
       oldDep[TableFields.manager][TableFields.name_] = depObj[TableFields.manager][TableFields.name_];
       oldDep[TableFields.manager][TableFields.email] = depObj[TableFields.manager][TableFields.email];
       oldDep[TableFields.manager][TableFields.reference] = depObj[TableFields.manager][TableFields.reference];
       await oldDep.save();
    }

    static deleteDepartmentById = async(depId) =>{
        console.log('11',depId);
        
        await Department.findById(depId);
        await Department.findByIdAndDelete(depId);    
    }

    static addBonus = async(empId,bonusType,bonusAmount,dateGranted)=>{
      let employee = await Employee.findById(empId);
       employee[TableFields.bonuses].push({
        [TableFields.bonusType]:bonusType,
        [TableFields.bonusAmount]:bonusAmount,
        [TableFields.dateGranted]:dateGranted
       });
      await employee.save();
    }

    static updateBonus = async(bonusId,bonusType,bonusAmount,dateGranted,empId) =>{
        let employee = await Employee.findById(empId);
        const arr = employee[TableFields.bonuses];
        let my = arr.filter((b)=>{
            return b[TableFields.ID].toString() === bonusId;
            });
        my[0][TableFields.bonusType] = bonusType;
        my[0][TableFields.bonusAmount] = bonusAmount;
        my[0][TableFields.dateGranted]  = dateGranted;
       await employee.save();

    }

    static deleteBonus = async(empId,bonusId) =>{
        let employee = await Employee.findById(empId);
        const arr = employee[TableFields.bonuses];
        let my =  arr.filter((b)=>{
            return b[TableFields.ID].toString() !== bonusId; 
            });
        employee[TableFields.bonuses] = my;
        await employee.save();
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

module.exports = OrganisationAdminService;