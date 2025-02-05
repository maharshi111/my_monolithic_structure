const {
  TableFields,
  ValidationMsgs,
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

exports.addEmployee = async (req, res, next) => {
  const reqBody = req.body;

  const orgId = new mongoose.Types.ObjectId(req.orgId);

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
};

exports.editEmployee = async (req, res, next) => {
  const reqBody = req.body;
  const orgId = new mongoose.Types.ObjectId(req.orgId);
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
      if (bool) {
        emailUtil.addEmployeeEmail(
          empObject[TableFields.email],
          empObject[TableFields.password],
          empObject[TableFields.workEmail]
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
  if (!Util.isAlphaNumeric(reqBody[TableFields.password])) {
    throw new ValidationError(ValidationMsgs.IsAlphaNumericPassword);
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
      existingEmployeeProfile[TableFields.depName]
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
        let flag = false;
        for (let dep of departmentNameArr) {
          if (
            dep[TableFields.departmentName] ===
            reqBody[TableFields.depName].trim().toUpperCase()
          ) {
            flag = true;
            depId = dep[TableFields.ID];
          }
        }
        if (flag === false) {
          throw new ValidationError(ValidationMsgs.DepartmentNotExists);
        }
      }
      empObject = {
        [TableFields.firstName]: reqBody[TableFields.firstName]
          .trim()
          .toUpperCase(),
        [TableFields.lastName]: reqBody[TableFields.lastName]
          .trim()
          .toUpperCase(),
        [TableFields.email]: reqBody[TableFields.email].trim().toLowerCase(),
        [TableFields.workEmail]: reqBody[TableFields.workEmail]
          .trim()
          .toLowerCase(),
        [TableFields.password]: reqBody[TableFields.password].trim(),
        [TableFields.phone]: reqBody[TableFields.phone].trim(),
        [TableFields.address]: reqBody[TableFields.address].trim(),
        [TableFields.dateOfBirth]: reqBody[TableFields.dateOfBirth].trim(),
        [TableFields.basicSalary]: reqBody[TableFields.basicSalary].trim(),
        [TableFields.joiningDate]: reqBody[TableFields.joiningDate].trim(),
        [TableFields.role]: reqBody[TableFields.role].trim(),
        [TableFields.department]: {
          [TableFields.name_]: reqBody[TableFields.depName]
            .trim()
            .toUpperCase(),
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
      let flag = false;
      for (let dep of departmentNameArr) {
        if (
          dep[TableFields.departmentName] ===
          reqBody[TableFields.depName].toUpperCase()
        ) {
          flag = true;
        }
      }
      if (flag === false) {
        throw new ValidationError(ValidationMsgs.DepartmentNotExists);
      }
      if (!MongoUtil.isValidObjectID(reqBody[TableFields.empId])) {
        throw new ValidationError(ValidationMsgs.IdEmpty);
      }
      let depId;
      let employee = await EmployeeService.findEmpById(
        reqBody[TableFields.empId]
      )
        .withBasicInfoEmp()
        .execute();
      for (let dep of departmentNameArr) {
        if (
          dep[TableFields.departmentName] ===
          reqBody[TableFields.depName].toUpperCase()
        ) {
          console.log("##2");

          depId = dep[TableFields.ID];
        }
      }
    
      let empObject = {
        [TableFields.firstName]: reqBody[TableFields.firstName].toUpperCase(),
        [TableFields.lastName]: reqBody[TableFields.lastName].toUpperCase(),
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
          [TableFields.name_]: reqBody[TableFields.depName].toUpperCase(),
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
  if (!MongoUtil.isValidObjectID(empId)) {
    throw new ValidationError(ValidationMsgs.IdEmpty);
  }
  await EmployeeService.deleteEmployee(empId);
};
