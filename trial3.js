

if (!reqBody[TableFields.orgName].trim()) {
    throw new ValidationError(ValidationMsgs.OrgNameEmpty);
  }
  if (
    !Util.ValidationMsgsLength(reqBody[TableFields.orgName], 30, 3, [
      TableFields.orgName,
    ]).flag
  ) {
    console.log(
      Util.ValidationMsgsLength(reqBody[TableFields.orgName], 30, 3, [
        TableFields.orgName,
      ]).message
    );

    throw new ValidationError(
      Util.ValidationMsgsLength(reqBody[TableFields.orgName], 30, 3, [
        TableFields.orgName,
      ]).message
    );
  }
  if (!reqBody[TableFields.linkedinUrl].trim()) {
    throw new ValidationError(ValidationMsgs.LinkedinUrlEmpty);
  }
  if (!Util.isUrlValid(reqBody[TableFields.linkedinUrl].trim())) {
    throw new ValidationError(ValidationMsgs.UrlInvalid);
  }
  if (!reqBody[TableFields.websiteUrl].trim()) {
    throw new ValidationError(ValidationMsgs.WebsiteUrlEmpty);
  }
  if (!Util.isUrlValid(reqBody[TableFields.websiteUrl].trim())) {
    throw new ValidationError(ValidationMsgs.UrlInvalid);
  }
  if (!reqBody[TableFields.country].trim()) {
    throw new ValidationError(ValidationMsgs.CountryEmpty);
  }
  if (
    !Util.ValidationMsgsLength(reqBody[TableFields.country], 70, 0, [
      TableFields.country,
    ]).flag
  ) {
    throw new ValidationError(
      Util.ValidationMsgsLength(reqBody[TableFields.country], 70, 0, [
        TableFields.country,
      ]).message
    );
  }
  if (!Util.isAlpha(reqBody[TableFields.country].trim())) {
    throw new ValidationError(ValidationMsgs.IsAlphaInvalidCountry);
  }
  if (!reqBody[TableFields.city].trim()) {
    throw new ValidationError(ValidationMsgs.CityEmpty);
  }
  if (
    !Util.ValidationMsgsLength(reqBody[TableFields.city], 70, 0, [
      TableFields.city,
    ]).flag
  ) {
    throw new ValidationError(
      Util.ValidationMsgsLength(reqBody[TableFields.city], 70, 0, [
        TableFields.city,
      ]).message
    );
  }
  if (!Util.isAlpha(reqBody[TableFields.city].trim())) {
    throw new ValidationError(ValidationMsgs.IsAlphaInvalidCity);
  }
  if (!reqBody[TableFields.street].trim()) {
    throw new ValidationError(ValidationMsgs.StreetEmpty);
  }
  if (
    !Util.ValidationMsgsLength(reqBody[TableFields.street], 100, 0, [
      TableFields.street,
    ]).flag
  ) {
    throw new ValidationError(
      Util.ValidationMsgsLength(reqBody[TableFields.street], 100, 0, [
        TableFields.street,
      ]).message
    );
  }
  if (!reqBody[TableFields.ceoName].trim()) {
    throw new ValidationError(ValidationMsgs.OrgCeoEmpty);
  }
  if (
    !Util.ValidationMsgsLength(reqBody[TableFields.ceoName], 30, 0, [
      TableFields.ceoName,
    ]).flag
  ) {
    throw new ValidationError(
      Util.ValidationMsgsLength(reqBody[TableFields.ceoName], 30, 0, [
        TableFields.ceoName,
      ]).message
    );
  }
  if (!reqBody[TableFields.postalCode]) {
    throw new ValidationError(ValidationMsgs.PostalCodeEmpty);
  }

  if (!Util.isDigit(reqBody[TableFields.postalCode].trim())) {
    throw new ValidationError(ValidationMsgs.NumericInvalid);
  }

  if (reqBody[TableFields.postalCode].trim().length != 6) {
    console.log("inside");

    throw new ValidationError(ValidationMsgs.PostalCodeInvalid);
  }

  if (!reqBody[TableFields.ceoEmail].trim()) {
    throw new ValidationError(ValidationMsgs.EmailEmpty);
  }
  if (!Util.isEmail(reqBody[TableFields.ceoEmail].trim())) {
    throw new ValidationError(ValidationMsgs.EmailInvalid);
  }
  if (
    !Util.ValidationMsgsLength(reqBody[TableFields.ceoEmail], 30, 0, [
      TableFields.ceoEmail,
    ]).flag
  ) {
    throw new ValidationError(
      Util.ValidationMsgsLength(reqBody[TableFields.ceoEmail], 30, 0, [
        TableFields.ceoEmail,
      ]).message
    );
  }
  console.log("value of emps", reqBody[TableFields.empStrength].toString());
  if (reqBody[TableFields.empStrength].trim() === "") {
    throw new ValidationError(ValidationMsgs.EmployeeStrengthEmpty);
  }
  if (!Util.isDigit(reqBody[TableFields.empStrength].trim())) {
    throw new ValidationError(ValidationMsgs.NumericInvalid);
  }

  if (
    !Util.ValidationMsgsLength(reqBody[TableFields.empStrength], 7, 0, [
      TableFields.empStrength,
    ]).flag
  ) {
    throw new ValidationError(
      Util.ValidationMsgsLength(reqBody[TableFields.empStrength], 7, 0, [
        TableFields.empStrength,
      ]).message
    );
  }
  if (reqBody[TableFields.subscriptionStart].trim() === "") {
    throw new ValidationError(ValidationMsgs.DateEmpty);
  }
  if (!Util.isDate(reqBody[TableFields.subscriptionStart])) {
    throw new ValidationError(ValidationMsgs.InvalidDate);
  }
  const result = Util.subscriptionStartInvalidEdit(
    reqBody[TableFields.subscriptionStart].trim()
  );
  console.log("this is start date", reqBody[TableFields.subscriptionStart]);
  if (!result.success) {
    throw new ValidationError(result.msg);
  }
  if (reqBody[TableFields.subscriptionPeriod].trim() === "") {
    throw new ValidationError(ValidationMsgs.SubscriptionPeriodEmpty);
  }

  if (!Util.isDigit(reqBody[TableFields.subscriptionPeriod].trim())) {
    throw new ValidationError(ValidationMsgs.NumericInvalid);
  }
  if (
    reqBody[TableFields.subscriptionPeriod].trim() <= 0 ||
    reqBody[TableFields.subscriptionPeriod].trim() > 60
  ) {
    throw new ValidationError(ValidationMsgs.SubscriptionPeriodInvalid);
  }
  if (!reqBody[TableFields.charge].trim()) {
    throw new ValidationError(ValidationMsgs.SubscriptionChargeEmpty);
  }
  if (!Util.isDigit(reqBody[TableFields.charge].trim())) {
    throw new ValidationError(ValidationMsgs.InvalidCharge);
  }
  if (+reqBody[TableFields.charge].trim() > 999999) {
    throw new ValidationError(ValidationMsgs.SubscriptionChargeInvalid);
  }

  ///////////////////////////////////////////////////











  const myObj = {
    [TableFields.orgName]: reqBody[TableFields.orgName].toUpperCase(),
    [TableFields.orgLinkedinUrl]: reqBody[TableFields.linkedinUrl].trim(),
    [TableFields.orgWebsiteUrl]: reqBody[TableFields.websiteUrl].trim(),
    [TableFields.orgHeadOffice]: {
      [TableFields.city]: reqBody[TableFields.city].trim(),
      [TableFields.street]: reqBody[TableFields.street].trim(),
      [TableFields.country]: reqBody[TableFields.country].trim(),
      [TableFields.postalCode]: reqBody[TableFields.postalCode].trim(),
    },
    [TableFields.orgCEO]: {
      [TableFields.name_]: reqBody[TableFields.ceoName].trim(),
      [TableFields.email]: reqBody[TableFields.ceoEmail].trim().toLowerCase(),
    },
    [TableFields.employeeStrength]: Number(
      reqBody[TableFields.empStrength].trim()
    ),
    [TableFields.startDateOfSubscription]: new Date(
      reqBody[TableFields.subscriptionStart].trim()
    ).toISOString(),
    [TableFields.subscriptionPeriod]: Number(
      reqBody[TableFields.subscriptionPeriod].trim()
    ),
    [TableFields.subscriptionCharge]: Number(
      reqBody[TableFields.charge].trim()
    ),
  };