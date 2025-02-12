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
const DepartmentService = require("../../db/services/DepartmentService");
var mongoose = require("mongoose");
const { MongoUtil } = require("../../db/mongoose");
const ServiceManager = require("../../db/serviceManager");

exports.addDepartment = async (req, res, next) => {
  const reqBody = req.body;

  await parseAndValidateDepartment(
    reqBody,
    undefined,
    false,
    async (updatedFields) => {
      await DepartmentService.addDepartment(updatedFields);
    },
    req
  );
};

exports.editDepartment = async (req, res, next) => {
  const reqBody = req.body;

  if (!reqBody[TableFields.depId]) {
    throw new ValidationError(ValidationMsgs.DepIdEmpty);
  }
  if (!MongoUtil.isValidObjectID(reqBody[TableFields.depId])) {
    throw new ValidationError(ValidationMsgs.IdEmpty);
  }
  let existingDepartment = await DepartmentService.findDepByDepId(
    reqBody[TableFields.depId]
  ).execute();
  if (!existingDepartment) {
    throw new ValidationError(ValidationMsgs.RecordNotFound);
  }
  await parseAndValidateDepartment(
    reqBody,
    existingDepartment,
    true,
    async (updatedFields) => {
      await DepartmentService.editDepartment(
        reqBody[TableFields.depId],
        updatedFields
      );
    },
    req
  );
};

exports.deleteDepartment = async (req, res, next) => {
  const depId = req.params[TableFields.ID];

  if (!MongoUtil.isValidObjectID(depId)) {
    throw new ValidationError(ValidationMsgs.IdEmpty);
  }

  // await DepartmentService.deleteDepartmentById(depId);

  if (!(await DepartmentService.recordExists(depId))) {
    throw new ValidationError(ValidationMsgs.RecordNotFound);
  }

  await ServiceManager.cascadeDelete(TableNames.Department, depId);
};

async function parseAndValidateDepartment(
  reqBody,
  existingDepartment = {},
  isUpdate = false,
  onValidationCompleted = async () => {},
  req
) {
  if (
    isFieldEmpty(
      reqBody[TableFields.depName],
      existingDepartment[TableFields.departmentName]
    )
  ) {
    throw new ValidationError(ValidationMsgs.DepNameEmpty);
  }

  if (
    isFieldEmpty(
      reqBody[TableFields.managerName],
      existingDepartment?.[TableFields.manager]?.[TableFields.name_]
    )
  ) {
    throw new ValidationError(ValidationMsgs.ManagerNameEmpty);
  }

  if (
    isFieldEmpty(
      reqBody[TableFields.email],
      existingDepartment?.[TableFields.manager]?.[TableFields.email]
    )
  ) {
    throw new ValidationError(ValidationMsgs.EmailEmpty);
  }
  let emp;
  if (reqBody[TableFields.email]) {
    emp = await EmployeeService.findEmpByWorkEmail(
      reqBody[TableFields.email].trim().toLowerCase()
    )
      .withNameInfoEmp()
      .execute();
    if (!emp) {
      throw new ValidationError(ValidationMsgs.WorkEmailNotExists);
    }
  }

  let mName;
  let empId;
  try {
    if (reqBody[TableFields.email]) {
      if (reqBody[TableFields.managerName]) {
        let fullName = reqBody[TableFields.managerName].trim();
        let arr = fullName.split(" ");
        let ln = arr[0].toUpperCase();
        let fn = arr.pop().toUpperCase();
        console.log(fn);
        console.log(ln);
        if (
          fn !== emp[TableFields.firstName] ||
          ln !== emp[TableFields.lastName]
        ) {
          throw new ValidationError(ValidationMsgs.NameAndEmailMistmatch);
        }
        console.log("this is emp", emp);

        mName = ln + " " + fn;
      }
      empId = new mongoose.Types.ObjectId(emp[TableFields.ID]);
    }

    const orgId = new mongoose.Types.ObjectId(req[TableFields.orgId]);
    let depObject = {
      [TableFields.departmentName]: reqBody[TableFields.depName],
      [TableFields.manager]: {
        [TableFields.reference]: empId,
        [TableFields.name_]:
          mName ||
          existingDepartment?.[TableFields.manager]?.[TableFields.name_],
        [TableFields.email]:
          reqBody[TableFields.email] ||
          existingDepartment?.[TableFields.manager]?.[TableFields.email],
      },
      [TableFields.organisationId]: orgId,
    };
    await onValidationCompleted(depObject);
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
