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

exports.postAddBonus = async (req, res, next) => {
  const reqBody = req.body;
  const empId = req.params[TableFields.ID];
  if (!MongoUtil.isValidObjectID(empId)) {
    throw new ValidationError(ValidationMsgs.IdEmpty);
  }
  await parseAndValidateBonus(
    reqBody,
    undefined,
    false,
    async (updatedFields) => {
      await EmployeeService.addBonus(
        empId,
        updatedFields[TableFields.bonusType].trim(),
        updatedFields[TableFields.bonusAmount].trim(),
        updatedFields[TableFields.dateGranted].trim()
      );
    }
  );
};

exports.postUpdateBonus = async (req, res, next) => {
  const reqBody = req.body;
  const bonusId = req.params[TableFields.ID];

  if (!MongoUtil.isValidObjectID(bonusId)) {
    throw new ValidationError(ValidationMsgs.IdEmpty);
  }

  if (!MongoUtil.isValidObjectID(reqBody[TableFields.empId])) {
    throw new ValidationError(ValidationMsgs.IdEmpty);
  }

  let existingData = await EmployeeService.findBonus(
    reqBody[TableFields.empId],
    bonusId
  )
    .withBonusInfoEmp()
    .execute();

  console.log("--->", existingData);

  if (!existingData) {
    throw new ValidationError(ValidationMsgs.RecordNotFound);
  }

  await parseAndValidateBonus(
    reqBody,
    existingData,
    true,
    async (updatedFields) => {
      console.log(
        updatedFields[TableFields.bonusType],
        updatedFields[TableFields.bonusAmount],
        updatedFields[TableFields.dateGranted],
        reqBody[TableFields.empId]
      );

      let obj = {
        [TableFields.bonusType]: updatedFields[TableFields.bonusType],
        [TableFields.bonusAmount]: updatedFields[TableFields.bonusAmount],
        [TableFields.dateGranted]: updatedFields[TableFields.dateGranted],
      };
      await EmployeeService.updateBonus(
        bonusId,
        reqBody[TableFields.empId],
        obj
      );
    }
  );
};



exports.postDeleteBonus = async (req, res, next) => {
  console.log(req.params.idString);
  console.log(req.params);

  const str = req.params[TableFields.idString];
  let arr = str.split("+");
  const bonusId = arr[0];
  const empId = arr[1];
  await EmployeeService.deleteBonus(empId, bonusId);
};

async function parseAndValidateBonus(
    reqBody,
    existingBonus = {},
    isUpdate = false,
    onValidationCompleted = async () => {}
  ) {
    if (
      isFieldEmpty(
        reqBody[TableFields.bonusType],
        existingBonus[TableFields.bonusType]
      )
    ) {
      throw new ValidationError(ValidationMsgs.BonusTypeEmpty);
    }
   
    if (
      isFieldEmpty(
        reqBody[TableFields.bonusAmount],
        existingBonus[TableFields.bonusAmount]
      )
    ) {
      throw new ValidationError(ValidationMsgs.BonusAmountEmpty);
    }
    
    
    if (
      isFieldEmpty(
        reqBody[TableFields.dateGranted],
        existingBonus[TableFields.dateGranted]
      )
    ) {
      throw new ValidationError(ValidationMsgs.DateEmpty);
    }

   
  
    try {
      let response = await onValidationCompleted({
        [TableFields.bonusType]: reqBody[TableFields.bonusType].trim(),
        [TableFields.bonusAmount]: reqBody[TableFields.bonusAmount].trim(),
        [TableFields.dateGranted]: reqBody[TableFields.dateGranted],
      });
      return response;
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
