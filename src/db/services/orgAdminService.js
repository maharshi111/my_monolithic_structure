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
        let employee = new Employee(empObject);
        console.log('emp:',employee);
        
        await employee.save();
        console.log('***');
        
        await emailUtil.addEmployeeEmail(empObject[TableFields.email],empObject[TableFields.password],empObject[TableFields.workEmail]);
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