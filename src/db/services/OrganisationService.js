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
const { MongoUtil } = require("../mongoose");

class OrganisationService {
  static recordExists = async (recordId) => {
    return await Organisation.exists({
      [TableFields.ID]: MongoUtil.toObjectId(recordId),
    });
  };

  static findOneOrgByEmail = (ceoEmail) => {
    return new ProjectionBuilder(async function () {
      return await Organisation.findOne(
        { [`${TableFields.orgCEO}.${TableFields.email}`]: ceoEmail },
        this
      );
    });
  };
  static findOneByOrgName = (orgName) => {
    return new ProjectionBuilder(async function () {
      return await Organisation.findOne(
        { [`${TableFields.orgName}`]: orgName },
        this
      );
    });
  };
  static findOrgByEmail = (ceoEmail) => {
    return new ProjectionBuilder(async function () {
      return await Organisation.find(
        { [`${TableFields.orgCEO}.${TableFields.email}`]: ceoEmail },
        this
      );
    });
  };
  static findOrgByUniqueId = (uId) => {
    return new ProjectionBuilder(async function () {
      return await Organisation.findOne(
        { [`${TableFields.uniqueId}`]: uId },
        this
      );
    });
  };

  static saveAuthToken = async (uId, token) => {
    await Organisation.updateOne(
      {
        [TableFields.uniqueId]: uId,
      },
      {
        $push: {
          [TableFields.tokens]: { [TableFields.token]: token },
        },
      }
    );
  };

  static removeAuth = async (adminId, authToken) => {
    await Organisation.updateOne(
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

  static findByIdOrgId = (orgId) => {
    return new ProjectionBuilder(async function () {
      return await Organisation.findById(orgId, this);
    });
  };

  static deleteOrganisation = async (orgId) => {
    await Organisation.findByIdAndDelete(orgId);
  };

  static addOrganisation = async (orgObject) => {
    const organisation = new Organisation(orgObject);

    if (!orgObject[TableFields.orgCEO][TableFields.email]) {
      throw new ValidationError(ValidationMsgs.EmailEmpty);
    }

    const error = organisation.validateSync();
    if (error) throw error;

    await organisation.save();
  };

  static editOrganisation = async (orgObj, orgId = {}) => {
    console.log("=====+++", orgObj);

    await Organisation.findByIdAndUpdate(
      orgId,
      { ...orgObj },
      {runValidators:true}
    );
  };

  static addEditAdmin = async (orgObject, orgId) => {
    await Organisation.findByIdAndUpdate(
      orgId,
      { $set: { [TableFields.orgAdmin]: { ...orgObject } } },
      { new: true }
    );
  };

  static deleteMyReferences = async (
    cascadeDeleteMethodReference,
    tableName,
    ...referenceId
  ) => {
    console.log("Organisation");

    let records = undefined;
    // console.log(cascadeDeleteMethodReference, tableName, ...referenceId);
    switch (tableName) {
      case TableNames.Organisation:
        console.log("switch org");

        records = await Organisation.find({
          [TableFields.ID]: {
            $in: referenceId,
          },
        });
        console.log("records org", records);
        break;
    }
    if (records && records.length > 0) {
      let deleteRecordIds = records.map((a) => a[TableFields.ID]);
      console.log("deleteRecordIds org", deleteRecordIds);

      await Organisation.deleteMany({
        [TableFields.ID]: {
          $in: deleteRecordIds,
        },
      });

      if (tableName != TableNames.Organisation) {
        //It means that the above objects are deleted on request from model's references (And not from model itself)
        console.log("check org service");

        cascadeDeleteMethodReference.call(
          {
            ignoreSelfCall: true,
          },
          TableNames.College,
          ...deleteRecordIds
        ); //So, let's remove references which points to this model
      }
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
    this.withOrgCeo = () => {
      projection[TableFields.orgCEO] = 1;
      return this;
    };
    this.withOrgAdmin = () => {
      projection[TableFields.orgAdmin] = 1;
      return this;
    };
    this.withoutSuperAdminAndUniqueId = () => {
      projection[TableFields.superAdminResponsible] = 0;
      projection[TableFields.uniqueId] = 0;
      return this;
    };
    this.execute = async () => {
      return await methodToExecute.call(projection);
    };
  }
};
module.exports = OrganisationService;
