const nodemailer = require("nodemailer");
const hbs = require("hbs");
const path = require("path");
const customViewsDirPath = path.join(__dirname, "../../views");

exports.SendForgotPasswordEmail = async (email) => {
  console.log(">>", email);
  await sendEmail(email, "Sharing New Password", `<b>Password :</b> 12345`);
};
exports.SendForgotPasswordEmailOrg = async (email) => {
  console.log(email);
  await sendEmail(
    email,
    "Sharing New OrganisationId",
    `<b>orgId :</b> ed429bfb-5807-4c5c-b1e7-ff0d50d21c40`
  );
};
exports.addOrganisationEmail = async (email, uId) => {
  await sendEmail(
    email,
    "Sharing of OrganisationId",
    `<b>OrganisationId of your organisation is: </b> ${uId}<br>`
  );
  console.log("email sent");
};
exports.addEmployeeEmail = async (personalEmail, password, workEmail) => {
  console.log(">>>", personalEmail);

  await sendEmail(
    personalEmail,
    "Sharing of credentials",
    `<b>Password : </b> ${password}<br> <b>Work Email: </b> ${workEmail}`
  );
};

////####################################################################
exports.inviteHR = async (email, name, password) => {
  let template = await hbs.renderFile(
    path.join(customViewsDirPath, "email", "hr_invite.hbs"),
    {
      email: email,
      name: name,
      password: password,
    }
  );
  await sendEmail(email, "xxx: Organization Invitation", template);
};

exports.SendAccountRegistrationdEmail = async (
  email,
  name,
  phone,
  organisationName
) => {
  let template = await hbs.renderFile(
    path.join(customViewsDirPath, "email", "account-register.hbs"),
    {
      email: email,
      name: name,
      phoneNumber: phone,
      organisationName: organisationName,
    }
  );
  await sendEmail(email, "xxx: Account Registration", template);
};

async function sendEmail(
  receiverEmail,
  subject,
  htmlBodyContents,
  fromAddress = "extradrive1519@gmail.com"
) {
  let transporter = getTransportInfo();
  let mailOptions = {
    from: fromAddress,
    to: receiverEmail,
    subject: subject,
    html: htmlBodyContents,
  };
  if (process.env.disableEmail == true || process.env.disableEmail == "true") {
    return;
  }
  console.log("==>", mailOptions);

  await transporter.sendMail(mailOptions);
}

function getTransportInfo() {
  return nodemailer.createTransport(
    {
      host: process.env.SMTP_SERVER,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, //smtpUsername
        pass: process.env.SMTP_PASS, //smtpPassword
      },
    },
    {
      from: `${process.env.SMTP_SENDER_NAME} <${process.env.SMTP_SENDER_EMAIL}>`,
    }
  );
}
