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
const Employee = require("../models/employee");
const Department = require("../models/department");
const emailUtil = require("../../utils/email");
const employee = require("../models/employee");

class DepartmentService {
  static findDepByOrgId = (orgId) => {
    return new ProjectionBuilder(async function () {
      return await Department.find(
        { [`${TableFields.organisationId}`]: orgId },
        this
      );
    });
  };

  static findDepByDepId = (depId) => {
    return new ProjectionBuilder(async function () {
      return await Department.findById(
        { [TableFields.ID]: depId },
        this
      );
    });
  };

  static addDepartment = async (depObj) => {
    if (!depObj[TableFields.manager][TableFields.email]) {
      throw new ValidationError(ValidationMsgs.EmailEmpty);
    }
    const department = new Department(depObj);
    const error = department.validateSync();
    if (error) throw error;
    await department.save();
  };

  static editDepartment = async (depId, depObj) => {
    await Department.findByIdAndUpdate(
      { [TableFields.ID]: depId },
      {
        $set: { ...depObj },
      }
    );
  };

  static deleteDepartmentById = async (depId) => {
    await Department.findByIdAndDelete(depId);
  };

  static deleteMyReferences = async (cascadeDeleteMethodReference, tableName, ...referenceId) => {
      let records = undefined;
      console.log('Department');
      
      // console.log(cascadeDeleteMethodReference, tableName, ...referenceId);
      switch (tableName) {
          case TableNames.Organisation:
            console.log('switch dep');
              records = await Department.find({
                  [TableFields.organisationId]: {
                      $in: referenceId,
                  },
              });
              break;
      }
      if (records && records.length > 0) {
          let deleteRecordIds = records.map((a) => a[TableFields.ID]);
          console.log('deleteRecordIds department',deleteRecordIds);
          
          await Department.deleteMany({
              [TableFields.ID]: {
                  $in: deleteRecordIds,
              },
          });
  
          // if (tableName != TableNames.College) {
          //     //It means that the above objects are deleted on request from model's references (And not from model itself)
          //     cascadeDeleteMethodReference.call(
          //         {
          //             ignoreSelfCall: true,
          //         },
          //         TableNames.College,
          //         ...deleteRecordIds
          //     ); //So, let's remove references which points to this model
          // }
      }
  };






}

const ProjectionBuilder = class {
  constructor(methodToExecute) {
    const projection = {};
    this.withBasicInfoOrg = () => {
      projection[TableFields.orgName] = 1;
      projection[TableFields.ID] = 1;
      projection[TableFields.orgCEO] = 1;
      projection[TableFields.uniqueId] = 1;
      return this;
    };
    this.withUniqueId = () => {
      projection[TableFields.uniqueId] = 1;
      return this;
    };
    this.withTokenInfo = () => {
      projection[TableFields.orgName] = 1;
      projection[TableFields.ID] = 1;
      projection[TableFields.orgCEO] = 1;
      return this;
    };
    this.withBasicInfoEmp = () => {
      projection[TableFields.organisationId] = 1;
      projection[TableFields.ID] = 1;
      projection[TableFields.email] = 1;
      projection[TableFields.bonuses] = 1;
      return this;
    };
    this.withNameInfoEmp = () => {
      projection[TableFields.firstName] = 1;
      projection[TableFields.lastName] = 1;
      projection[TableFields.ID] = 1;
      return this;
    };

    this.withBasicInfoDep = () => {
      projection[TableFields.departmentName] = 1;
      projection[TableFields.organisationId] = 1;
      projection[TableFields.ID] = 1;
      return this;
    };
    this.execute = async () => {
      return await methodToExecute.call(projection);
    };
  }
};

module.exports = DepartmentService;
