const nodemailer = require("nodemailer");
const hbs = require("hbs");
const path = require("path");
const customViewsDirPath = path.join(__dirname, "../../views");


exports.SendForgotPasswordEmail = async (email) => {
    console.log(email);
    await sendEmail(email, 'Sharing New Password',  `<b>Password :</b> 12345`);
};
exports.addOrganisationEmail = async (email,uId)=>{
    await sendEmail(email, 'Sharing of OrganisationId',  `<b>OrganisationId of facebook: </b> ${uId}<br>`);
}
// exports.editOrganisationEmail = async (email,uId)=>{
//     await sendEmail(email, 'Sharing of OrganisationId',  `<b>OrganisationId : </b> ${uId}<br>`);
// }

////
exports.inviteHR = async (email, name, password) => {
    let template = await hbs.renderFile(path.join(customViewsDirPath, "email", "hr_invite.hbs"), {
        email: email,
        name: name,
        password: password,
    });
    await sendEmail(email, "xxx: Organization Invitation", template);
};



exports.SendAccountRegistrationdEmail = async (email, name, phone, organisationName) => {
    let template = await hbs.renderFile(path.join(customViewsDirPath, "email", "account-register.hbs"), {
        email: email,
        name: name,
        phoneNumber: phone,
        organisationName: organisationName,
    });
    await sendEmail(email, "xxx: Account Registration", template);
};

async function sendEmail(receiverEmail, subject, htmlBodyContents, fromAddress = "extradrive1519@gmail.com") {
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
    await transporter.sendMail(mailOptions);
}

function getTransportInfo() {
    return nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER, //smtpUsername
            pass: process.env.SMTP_PASS, //smtpPassword
        },
    }, {
        from: `${process.env.SMTP_SENDER_NAME} <${process.env.SMTP_SENDER_EMAIL}>`
    });
}