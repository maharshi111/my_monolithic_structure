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
         return await SuperAdmin.findOne({ [TableFields.email]: email },this);
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
              )
              .lean(lean);
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
                      [TableFields.tokens]: {[TableFields.token]: token},
                  },
              }
          );
         
          
      };

  static addOrganisation = async (orgObject) => {
    console.log("orgObject", orgObject);
    const organisation = new Organisation(orgObject);
    console.log("organisation", organisation);
    // const error = organisation.validateSync();
    // console.log("error", error);
    // if (error) throw error;
    if (!orgObject[TableFields.orgCEO][TableFields.email]) {
      throw new ValidationError(ValidationMsgs.EmailEmpty);
    }
    await organisation.save();
    let receiverEmail = orgObject[TableFields.orgCEO][TableFields.email];
    emailUtil.addOrganisationEmail(
      receiverEmail,
      orgObject[TableFields.uniqueId]
    );
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
        this.withEmail = () => {
            projection[TableFields.email] = 1;
            return this;
        };
        this.withUserType = () => {
            projection[TableFields.userType] = 1;
            return this;
        };
        this.withId = () => {
            projection[TableFields.ID] = 1;
            return this;
        };
        this.withApproved = () => {
            projection[TableFields.approved] = 1;
            return this;
        };
        this.withName = () => {
            projection[TableFields.name_] = 1;
            return this;
        };
        this.withPasswordResetToken = () => {
            projection[TableFields.passwordResetToken] = 1;
            return this;
        };

        this.execute = async () => {
            return await methodToExecute.call(projection);
        };
    }
};

module.exports = SuperAdminService;
