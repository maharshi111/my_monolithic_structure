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
      return await SuperAdmin.findOne(
        {
          [TableFields.ID]: adminId,
          [TableFields.tokens + "." + TableFields.token]: token,
        },
        this
      ).lean(lean);
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

  static removeAuth = async (adminId, authToken) => {
    console.log("--->", authToken);
    console.log("->>>", adminId);

    await SuperAdmin.updateOne(
      {
        [TableFields.ID]: adminId,
      },
      {
        $pull: {
          [TableFields.tokens]: { [TableFields.token]: authToken },
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
  static findSuperAdminById = (id) =>{
    return new ProjectionBuilder(async function () {
        return await SuperAdmin.findById(id , this);
      });
  }
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
    this.withOrgCount = () =>{
        projection[TableFields.totalOrganisation] = 1;
        return this;
    }
    this.execute = async () => {
      return await methodToExecute.call(projection);
    };
  }
};

module.exports = SuperAdminService;
