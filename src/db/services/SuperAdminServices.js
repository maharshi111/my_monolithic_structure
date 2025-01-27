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
const emailUtil = require("../../utils/email");

class SuperAdminService {
  static saveSuperAdmim = async (recordzobj) => {
    const superAdmin = new SuperAdmin(recordzobj);
    if (!Util.isEmail(superAdmin[TableFields.email])) {
      throw new ValidationError(ValidationMsgs.EmailInvalid);
    }
    if (!superAdmin.isValidPassword(superAdmin[TableFields.password])) {
      throw new ValidationError(ValidationMsgs.PasswordInvalid);
    }

    const error = superAdmin.validateSync();
    if (error) throw error;
    await superAdmin.save();
  };

  static findByEmail = (email) => {
    return new ProjectionBuilder(async function () {
      return await SuperAdmin.findOne({ [TableFields.email]: email }, this);
    });
  };

  static getUserByIdAndToken = (adminId, token, lean = false) => {
    return new ProjectionBuilder(async function () {
      // console.log('adminId',adminId);
      // console.log('token inside service',token);

      return await SuperAdmin.findOne(
        {
          [TableFields.ID]: adminId,
          [TableFields.tokens + "." + TableFields.token]: token,
        },
        this
      ).lean(lean);
      //   console.log('value of a:',a);
    });
  };

  static saveAuthToken = async (userId, token) => {
    await SuperAdmin.updateOne(
      {
        [TableFields.ID]: userId,
      },
      {
        $push: {
          [TableFields.tokens]: { [TableFields.token]: token },
        },
      }
    );
  };

  static findOneSuperAdminByPassWord = (password) => {
    return new ProjectionBuilder(async function () {
      return await SuperAdmin.findOne(
        { [TableFields.password]: password },
        this
      );
    });
  };
}

const ProjectionBuilder = class {
  constructor(methodToExecute) {
    const projection = {};
    this.withBasicInfo = () => {
      projection[TableFields.name_] = 1;
      projection[TableFields.ID] = 1;
      projection[TableFields.email] = 1;
      return this;
    };
    this.withPassword = () => {
      projection[TableFields.password] = 1;
      return this;
    };
    // this.withEmail = () => {
    //     projection[TableFields.email] = 1;
    //     return this;
    // };
    // this.withOrgCeo = () =>{
    //     projection[TableFields.orgCEO] = 1;
    //     return this;
    // };
    // this.withOrgAdmin = () =>{
    //     projection[TableFields.orgAdmin]=1;
    //     return this;
    // };
    // this.withEmployeeBasicInfo = () =>{
    //     projection[TableFields.email]=1;
    //     projection[TableFields.workEmail]=1;
    //     projection[TableFields.ID]=1;
    //     projection[TableFields.organisationId]=1;
    //     return this;
    // };
    this.execute = async () => {
      return await methodToExecute.call(projection);
    };
  }
};

module.exports = SuperAdminService;
