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

class EmployeeService {
  static findEmpByOrgId = (orgId) => {
    return new ProjectionBuilder(async function () {
      return await Employee.find(
        { [`${TableFields.organisationId}`]: orgId },
        this
      );
    });
  };

  static findOneEmpByEmail = (adminEmail) => {
    return new ProjectionBuilder(async function () {
      return await Employee.findOne(
        { [`${TableFields.email}`]: adminEmail },
        this
      );
    });
  };

  static findEmpByWorkEmail = (email) => {
    return new ProjectionBuilder(async function () {
      return await Employee.findOne(
        { [`${TableFields.workEmail}`]: email },
        this
      );
    });
  };

  static findEmpByEmail = (email) => {
    return new ProjectionBuilder(async function () {
      return await Employee.findOne({ [`${TableFields.email}`]: email }, this);
    });
  };
  static findEmpByPhone = (phone) => {
    return new ProjectionBuilder(async function () {
      return await Employee.findOne({ [`${TableFields.phone}`]: phone }, this);
    });
  };

  static findEmpById = (empId) => {
    return new ProjectionBuilder(async function () {
      return await Employee.findById(empId, this);
    });
  };

  static addEmployee = async (empObject) => {
    if (!empObject[TableFields.email]) {
      throw new ValidationError(ValidationMsgs.EmailEmpty);
    }
    if (!empObject[TableFields.phone]) {
      throw new ValidationError(ValidationMsgs.PhoneEmpty);
    }
    if (!empObject[TableFields.workEmail]) {
      throw new ValidationError(ValidationMsgs.EmailEmpty);
    }
    let employee = new Employee(empObject);
    const error = employee.validateSync();
    if (error) throw error;
    await employee.save();
  };

  static addBonus = async (empId, bonusType, bonusAmount, dateGranted) => {
    await Employee.findByIdAndUpdate(empId, {
      $push: {
        [TableFields.bonuses]: {
          [TableFields.bonusType]: bonusType,
          [TableFields.bonusAmount]: bonusAmount,
          [TableFields.dateGranted]: dateGranted,
        },
      },
    });
  };

  static updateBonus = async (bonusId, empId, obj) => {
    await Employee.updateOne(
      {
        [TableFields.ID]: empId,
        [`${TableFields.bonuses}.${TableFields.ID}`]: bonusId,
      },
      {
        $set: {
          [`${TableFields.bonuses}.$.${TableFields.bonusType}`]:
            obj[TableFields.bonusType],
          [`${TableFields.bonuses}.$.${TableFields.bonusAmount}`]:
            obj[TableFields.bonusAmount],
          [`${TableFields.bonuses}.$.${TableFields.dateGranted}`]:
            obj[TableFields.dateGranted],
        },
      }
    );
  };

  static deleteBonus = async (empId, bonusId) => {
    await Employee.updateOne(
      {
        [TableFields.ID]: empId,
      },
      {
        $pull: {
          [TableFields.bonuses]: {
            [TableFields.ID]: bonusId,
          },
        },
      }
    );
  };

  static editEmployee = async (empObject, empId) => {
    Employee.findByIdAndUpdate(empId, { $set: { ...empObject } });
  };

  static deleteEmployee = async (empId) => {
    await Employee.findByIdAndDelete(empId);
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
    this.withBonusInfoEmp = () => {
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
    this.withEmployeeBasicInfo = () => {
      projection[TableFields.email] = 1;
      projection[TableFields.workEmail] = 1;
      projection[TableFields.ID] = 1;
      projection[TableFields.organisationId] = 1;
      return this;
    };
    this.execute = async () => {
      return await methodToExecute.call(projection);
    };
  }
};

module.exports = EmployeeService;
