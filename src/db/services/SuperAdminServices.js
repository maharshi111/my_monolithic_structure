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
    await organisation.save();//.save() is model's instance method
    let receiverEmail = orgObject[TableFields.orgCEO][TableFields.email];
       await emailUtil.addOrganisationEmail(
      receiverEmail,
      orgObject[TableFields.uniqueId]
    );
  };

  static editOrganisation = async(orgObj,orgId)=>{
    console.log('this isorgObj :',orgObj);
     let oldOrg =  await  Organisation.findById(orgId);
     //console.log('old org:',oldOrg);
     
     let pastEmail = oldOrg[TableFields.orgCEO][TableFields.email];
     oldOrg[TableFields.orgName] = orgObj[TableFields.orgName];
     oldOrg[TableFields.orgLinkedinUrl] = orgObj[TableFields.orgLinkedinUrl];
     oldOrg[TableFields.orgWebsiteUrl] = orgObj[TableFields.orgWebsiteUrl];
     oldOrg[TableFields.orgHeadOffice][TableFields.city] = orgObj[TableFields.orgHeadOffice][TableFields.city];
     oldOrg[TableFields.orgHeadOffice][TableFields.street] = orgObj[TableFields.orgHeadOffice][TableFields.street];
     oldOrg[TableFields.orgHeadOffice][TableFields.country] = orgObj[TableFields.orgHeadOffice][TableFields.country];
     oldOrg[TableFields.orgHeadOffice][TableFields.postalCode] = orgObj[TableFields.orgHeadOffice][TableFields.postalCode];
     oldOrg[TableFields.orgCEO][TableFields.name_] = orgObj[TableFields.orgCEO][TableFields.name_];
     oldOrg[TableFields.orgCEO][TableFields.email] = orgObj[TableFields.orgCEO][TableFields.email];
     oldOrg[TableFields.employeeStrength] = orgObj[TableFields.employeeStrength];
     oldOrg[TableFields.startDateOfSubscription] = orgObj[TableFields.startDateOfSubscription];
     oldOrg[TableFields.subscriptionPeriod] = orgObj[TableFields.subscriptionPeriod];
     oldOrg[TableFields.subscriptionCharge] = orgObj[TableFields.subscriptionCharge];
    
     console.log(pastEmail);
     console.log(orgObj[TableFields.orgCEO][TableFields.email]);
     //5a884
     await oldOrg.save() ;
     if(pastEmail!== orgObj[TableFields.orgCEO][TableFields.email]){
        await emailUtil.addOrganisationEmail(
                orgObj[TableFields.orgCEO][TableFields.email],
                oldOrg[TableFields.uniqueId]
            );
     }

  }

  
// old org: {
//     orgHeadOffice: {
//       city: 'Ahmedabad',
//       street: 'valam bunglows , near yesh tenament , Punit nagar road, Ghodasar, Ahmedabad ',
//       country: 'india',
//       postalCode: '788978'
//     },
//     orgCEO: { name: 'mark zuckerberg ', email: 'maharshirao1112002@gmail.com' },
//     _id: new ObjectId("67810a9ca72d7b038f34d982"),
//     orgName: 'check668',
//     orgLinkedinUrl: 'https://www.google.com/about/careers/applications/?utm_campaign=profilepage&utm_medium=profilepage&utm_source=linkedin&src=Online/LinkedIn/linkedin_page',
//     orgWebsiteUrl: 'https://www.google.com/about/careers/applications/?utm_campaign=profilepage&utm_medium=profilepage&utm_source=linkedin&src=Online/LinkedIn/linkedin_page',
//     employeeStrength: 79798,
//     startDateOfSubscription: 2025-01-09T00:00:00.000Z,
//     subscriptionPeriod: 10,
//     subscriptionCharge: 8486,
//     superAdminResponsible: new ObjectId("677e57910364489632d04a5e"),
//     uniqueId: '4c4c8167-2330-465d-85cd-bebb78ec99a6',
//     __v: 0
//   }
  
//   this isorgObj : {
//     orgName: 'facebook',
//     orgLinkedinUrl: 'https://www.linkedin.com/company/meta/?originalSubdomain=in',
//     orgWebsiteUrl: 'https://www.metacareers.com/',
//     orgHeadOffice: {
//       city: 'Delhi',
//       street: 'valam bunglows , near yesh tenament , Punit nagar road, Ghodasar, Ahmedabad ',
//       country: 'India',
//       postalCode: '123456'
//     },
//     orgCEO: { name: 'Mark Zuckerberg', email: 'mark@gmail.com' },
//     employeeStrength: 100,
//     startDateOfSubscription: '2025-01-01T00:00:00.000Z',
//     subscriptionPeriod: 36,
//     subscriptionCharge: 1000
//   }


  
  
  
  
  
  
  

  
  
  
  
  
  
  
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
