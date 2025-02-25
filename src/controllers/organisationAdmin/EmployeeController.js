const {
  TableFields,
  ValidationMsgs,
  TableNames,
  InterfaceTypes,
} = require("../../utils/constants");
const ValidationError = require("../../utils/ValidationError");
const SuperAdminService = require("../../db/services/SuperAdminServices");
const emailUtil = require("../../utils/email");
const Util = require("../../utils/util");
const EmployeeService = require("../../db/services/EmployeeService");
var mongoose = require("mongoose");
const { MongoUtil } = require("../../db/mongoose");
const DepartmentService = require("../../db/services/DepartmentService");
const ServiceManager = require("../../db/serviceManager");

exports.addEmployee = async (req, res, next) => {
  const reqBody = req.body;

  const orgId = new mongoose.Types.ObjectId(req[TableFields.orgId]);

  await parseAndValidateEmployee(
    reqBody,
    undefined,
    orgId,
    false,
    async (empObject) => {
      await EmployeeService.addEmployee(empObject);

      await emailUtil.addEmployeeEmail(
        empObject[TableFields.email],
        empObject[TableFields.password],
        empObject[TableFields.workEmail]
      );
    }
  );
  EmployeeService.employeeListnerForOrganisation(orgId);
};

exports.editEmployee = async (req, res, next) => {
  const reqBody = req.body;
  const orgId = new mongoose.Types.ObjectId(req[TableFields.orgId]);
  let employeeProfile = await EmployeeService.findEmpById(
    reqBody[TableFields.empId]
  ).execute();
  if (!employeeProfile) {
    throw new ValidationError(ValidationMsgs.RecordNotFound);
  }
  await parseAndValidateEmployee(
    reqBody,
    employeeProfile,
    orgId,
    true,
    async (empObject) => {
      let employee = await EmployeeService.findEmpById(
        reqBody[TableFields.empId]
      )
        .withBasicInfoEmp()
        .execute();
      console.log("???", employee);

      let bool = false;
      if (
        employee[TableFields.personalEmail] !==
          reqBody[TableFields.personalEmail] ||
        employee[TableFields.password] !== reqBody[TableFields.password] ||
        employee[TableFields.workEmail] !== reqBody[TableFields.workEmail]
      ) {
        bool = true;
      }
      await EmployeeService.editEmployee(empObject, reqBody[TableFields.empId]);
      let updatedEmployee = await EmployeeService.findEmpById(reqBody[TableFields.empId]).withEmployeeBasicInfo().execute();
      if (bool) {
        emailUtil.addEmployeeEmail(
            updatedEmployee[TableFields.email],
            updatedEmployee[TableFields.password],
            updatedEmployee[TableFields.workEmail]
        );
      }
    }
  );
};

async function parseAndValidateEmployee(
  reqBody,
  existingEmployeeProfile = {},
  orgId,
  update,
  onValidationCompleted = async () => {}
) {
  if (
    isFieldEmpty(
      reqBody[TableFields.firstName],
      existingEmployeeProfile[TableFields.firstName]
    )
  ) {
    throw new ValidationError(ValidationMsgs.FirstNameEmpty);
  }
 
  if (
    isFieldEmpty(
      reqBody[TableFields.lastName],
      existingEmployeeProfile[TableFields.lastName]
    )
  ) {
    throw new ValidationError(ValidationMsgs.LastNameEmpty);
  }
  
  if (
    isFieldEmpty(
      reqBody[TableFields.email],
      existingEmployeeProfile[TableFields.email]
    )
  ) {
    throw new ValidationError(ValidationMsgs.EmailEmpty);
  }
  
  if (
    isFieldEmpty(
      reqBody[TableFields.workEmail],
      existingEmployeeProfile[TableFields.workEmail]
    )
  ) {
    throw new ValidationError(ValidationMsgs.EmailEmpty);
  }
 
  if (
    isFieldEmpty(
      reqBody[TableFields.password],
      existingEmployeeProfile[TableFields.password]
    )
  ) {
    throw new ValidationError(ValidationMsgs.PasswordEmpty);
  }
  //check
  if(reqBody[TableFields.password]){
    if (!Util.isAlphaNumeric(reqBody[TableFields.password])) {
        throw new ValidationError(ValidationMsgs.IsAlphaNumericPassword);
      }
  }
 
  if (
    isFieldEmpty(
      reqBody[TableFields.address],
      existingEmployeeProfile[TableFields.address]
    )
  ) {
    throw new ValidationError(ValidationMsgs.AddressEmpty);
  }
  
  if (
    isFieldEmpty(
      reqBody[TableFields.role],
      existingEmployeeProfile[TableFields.role]
    )
  ) {
    throw new ValidationError(ValidationMsgs.RoleEmpty);
  }
 
  if (
    isFieldEmpty(
      reqBody[TableFields.phone],
      existingEmployeeProfile[TableFields.phone]
    )
  ) {
    throw new ValidationError(ValidationMsgs.PhoneEmpty);
  }

  if (
    isFieldEmpty(
      reqBody[TableFields.dateOfBirth],
      existingEmployeeProfile[TableFields.dateOfBirth]
    )
  ) {
    throw new ValidationError(ValidationMsgs.DateEmpty);
  }
 
  if (
    isFieldEmpty(
      reqBody[TableFields.basicSalary],
      existingEmployeeProfile[TableFields.basicSalary]
    )
  ) {
    throw new ValidationError(ValidationMsgs.SalaryEmpty);
  }
 
  if (
    isFieldEmpty(
      reqBody[TableFields.joiningDate],
      existingEmployeeProfile[TableFields.joiningDate]
    )
  ) {
    throw new ValidationError(ValidationMsgs.DateEmpty);
  }
  
  if (
    isFieldEmpty(
      reqBody[TableFields.depName],
      existingEmployeeProfile?.[TableFields.department]?.[TableFields.name_]
    )
  ) {
    throw new ValidationError(ValidationMsgs.DepNameEmpty);
  }

  if(!update){
    let existingEmail = await EmployeeService.findEmpByEmail(
        reqBody[TableFields.email]
      )
        .withBasicInfoEmp()
        .execute();
    
      if (existingEmail) {
        throw new ValidationError(ValidationMsgs.EmailAlreadyExists);
      }
    
      let existingWorkEmail = await EmployeeService.findEmpByWorkEmail(
        reqBody[TableFields.workEmail]
      )
        .withBasicInfoEmp()
        .execute();
    
      if (existingWorkEmail) {
        throw new ValidationError(ValidationMsgs.WorkEmailAlreadyExists);
      }
      let existingPhone = await EmployeeService.findEmpByPhone(
        reqBody[TableFields.phone]
      )
        .withBasicInfoEmp()
        .execute();

      if (existingPhone) {
        throw new ValidationError(ValidationMsgs.PhoneAlreadyExists);
      }

  }
 
  try {
    if (!update) {
      let empArr = await EmployeeService.findEmpByOrgId(orgId)
        .withBasicInfoEmp()
        .execute();
      console.log(empArr);
      let empObject;
      console.log("empArr.length", empArr.length);
      let depId;
      if (empArr.length !== 0) {
        let departmentNameArr = await DepartmentService.findDepByOrgId(orgId)
          .withBasicInfoDep()
          .execute();
        console.log(departmentNameArr);
        //let flag = false;
        // for (let dep of departmentNameArr) {
        //   if (
        //     dep[TableFields.departmentName] ===
        //     reqBody[TableFields.depName].trim().toUpperCase()
        //   ) {
        //     flag = true;
        //     depId = dep[TableFields.ID];
        //   }
        // }
         // if (flag === false) {
        //   throw new ValidationError(ValidationMsgs.DepartmentNotExists);
        // }
        const exists = departmentNameArr.some((dep)=>{
          if( dep[TableFields.departmentName] ===
            reqBody[TableFields.depName].trim().toUpperCase())
            {
                depId = dep[TableFields.ID];
                return true; 
            }
            return false;
        })

        if (!exists) {
          throw new ValidationError(ValidationMsgs.DepartmentNotExists);
        }
       
      }
      empObject = {
        [TableFields.firstName]: reqBody[TableFields.firstName], 
        [TableFields.lastName]: reqBody[TableFields.lastName],
        [TableFields.email]: reqBody[TableFields.email],
        [TableFields.workEmail]: reqBody[TableFields.workEmail],
        [TableFields.password]: reqBody[TableFields.password],
        [TableFields.phone]: reqBody[TableFields.phone],
        [TableFields.address]: reqBody[TableFields.address],
        [TableFields.dateOfBirth]: reqBody[TableFields.dateOfBirth],
        [TableFields.basicSalary]: reqBody[TableFields.basicSalary],
        [TableFields.joiningDate]: reqBody[TableFields.joiningDate],
        [TableFields.role]: reqBody[TableFields.role],
        [TableFields.department]: {
          [TableFields.name_]: reqBody[TableFields.depName],
          //[TableFields.reference]: depId,
          ...(empArr.length !== 0 && {
            [TableFields.reference]: depId,
          }),
        },
        [TableFields.organisationId]: orgId,
      };
      return await onValidationCompleted(empObject);
    } else {
      let departmentNameArr = await DepartmentService.findDepByOrgId(orgId)
        .withBasicInfoDep()
        .execute();
    //   let flag = false;
    //   for (let dep of departmentNameArr) {
    //     if (
    //       dep[TableFields.departmentName] ===
    //       reqBody[TableFields.depName].toUpperCase()
    //     ) {
    //       flag = true;
    //     }
    //   }
    // if (flag === false) {
    //     throw new ValidationError(ValidationMsgs.DepartmentNotExists);
    //   }
    let depId;

    if(reqBody[TableFields.depName]){
        const exists = departmentNameArr.some((dep)=>{

        if( dep[TableFields.departmentName] ===
          reqBody[TableFields.depName].trim().toUpperCase())
          {
              depId = dep[TableFields.ID];
              return true; 
          }

          return false;
      })

      if (!exists) {
        throw new ValidationError(ValidationMsgs.DepartmentNotExists);
      }
      
    }
    
      if (!MongoUtil.isValidObjectID(reqBody[TableFields.empId])) {
        throw new ValidationError(ValidationMsgs.IdEmpty);
      }
      
    //   let employee = await EmployeeService.findEmpById(
    //     reqBody[TableFields.empId]
    //   )
    //     .withBasicInfoEmp()
    //     .execute();
    //   for (let dep of departmentNameArr) {
    //     if (
    //       dep[TableFields.departmentName] ===
    //       reqBody[TableFields.depName].toUpperCase()
    //     ) {
    //       console.log("##2");

    //       depId = dep[TableFields.ID];
    //     }
    //  }
    
      let empObject = {
        [TableFields.firstName]: reqBody[TableFields.firstName],
        [TableFields.lastName]: reqBody[TableFields.lastName],
        [TableFields.email]: reqBody[TableFields.email],
        [TableFields.workEmail]: reqBody[TableFields.workEmail],
        [TableFields.password]: reqBody[TableFields.password],
        [TableFields.phone]: reqBody[TableFields.phone],
        [TableFields.address]: reqBody[TableFields.address],
        [TableFields.dateOfBirth]: reqBody[TableFields.dateOfBirth],
        [TableFields.basicSalary]: reqBody[TableFields.basicSalary],
        [TableFields.joiningDate]: reqBody[TableFields.joiningDate],
        [TableFields.role]: reqBody[TableFields.role],
        [TableFields.department]: {
          [TableFields.name_]: reqBody[TableFields.depName] || existingEmployeeProfile[TableFields.department][TableFields.name_],
          [TableFields.reference]: depId,
        },
        [TableFields.organisationId]: orgId,
      };
      console.log(">>>>", empObject);

      return await onValidationCompleted(empObject);
    }
  } catch (error) {
    throw error;
  }
}

function isFieldEmpty(providedField, existingField) { 
  if (providedField != undefined) {
    if (providedField) {
      return false;
    }
  } else if (existingField) {
    return false;
  }
  return true;
}

/* ################################################### */
exports.deleteEmployee = async (req, res, next) => {
  const empId = req.params[TableFields.ID];
  const orgId = new mongoose.Types.ObjectId(req[TableFields.orgId]);
  if (!MongoUtil.isValidObjectID(empId)) {
    throw new ValidationError(ValidationMsgs.IdEmpty);
  }
  if(!await EmployeeService.recordExists(empId)){
    throw new ValidationError(ValidationMsgs.RecordNotFound);
  }
  //await EmployeeService.deleteEmployee(empId);
  console.log('in emp controller');
  
  await ServiceManager.cascadeDelete(TableNames.Employee,empId);
 // await EmployeeService.employeeListnerForOrganisation(orgId);
//   setTimeout(()=>{
//     EmployeeService.employeeListnerForOrganisation(orgId);
//   },2000);

};
