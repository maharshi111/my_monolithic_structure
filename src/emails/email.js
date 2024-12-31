const Handlebars = require("handlebars");
const S3 = require("../utils/storage/S3");
const {GeneralMessages, TableFields} = require("../utils/constants");
const {Util} = require("../utils/utils");
const path = require("path");
const fs = require("fs");
const customViewsDirPath = path.join(__dirname, "../../templates");
const nodemailer = require("nodemailer");

exports.sendForgotPasswordEmail = async (emailId, name, code) => {
    const resetPasswordTemplate = fs.readFileSync(path.join(customViewsDirPath, "emails", "filename.hbs")).toString();
    let data = {
        name: name,
        code: code,
    };
    const template = Handlebars.compile(resetPasswordTemplate);
    try {
        await sendEmail(emailId, GeneralMessages.forgotPasswordEmailSubject, template(data));
    } catch (e) {
        console.log(e);
    }
};

function createHyperLinkTag(title, url) {
    return `<a href="${url}">${title}</a>`;
}

async function sendEmail(receiverEmail, subject, htmlBodyContents, fromAddress = "") {
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
        host: "",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "", //smtpUsername
            pass: "", //smtpPassword
        },
    });
}
