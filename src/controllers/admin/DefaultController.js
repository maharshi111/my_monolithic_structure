const fs = require("fs");
var path = require("path");

exports.getPrivacyPolicy = async function (req) {
    var filePath = path.join(__dirname, "../../", "storage/cms", "privacyPolicy.txt");

    let pagecontent = "";
    if (fs.existsSync(filePath)) {
        pagecontent = fs.readFileSync(filePath, "utf8");
    }
    return pagecontent;
};

exports.getAboutUs = async function (req) {
    var filePath = path.join(__dirname, "../../", "storage/cms", "aboutUs.txt");

    let pagecontent = "";
    if (fs.existsSync(filePath)) {
        pagecontent = fs.readFileSync(filePath, "utf8");
    }
    return pagecontent;
};

exports.getTermsAndConditions = async function (req) {
    var filePath = path.join(__dirname, "../../", "storage/cms", "termsAndConditions.txt");

    let pagecontent = "";
    if (fs.existsSync(filePath)) {
        pagecontent = fs.readFileSync(filePath, "utf8");
    }
    return pagecontent;
};

exports.editAboutUs = async function (req, res) {
    try {
        var filePath = path.join(__dirname, "../../", "storage/cms", "aboutUs.txt");

        if (fs.existsSync(filePath)) {
            fs.writeFile(filePath, req.body.content, function (err) {
                if (err) throw err;
            });
        } else {
            fs.writeFile(filePath, req.body.content, function (err) {
                if (err) throw err;
            });
        }
    } catch (error) {
        throw new error();
    }
};

exports.editPrivacyPolicy = async function (req, res) {
    try {
        var filePath = path.join(__dirname, "../../", "storage/cms", "privacyPolicy.txt");

        if (fs.existsSync(filePath)) {
            fs.writeFile(filePath, req.body.content, function (err) {
                if (err) throw err;
            });
        } else {
            fs.writeFile(filePath, req.body.content, function (err) {
                if (err) throw err;
            });
        }
    } catch (error) {
        throw new error();
    }
};

exports.editTermsAndConditions = async function (req, res) {
    try {
        var filePath = path.join(__dirname, "../../", "storage/cms", "termsAndConditions.txt");

        if (fs.existsSync(filePath)) {
            fs.writeFile(filePath, req.body.content, function (err) {
                if (err) throw err;
            });
        } else {
            fs.writeFile(filePath, req.body.content, function (err) {
                if (err) throw err;
            });
        }
    } catch (error) {
        throw new error();
    }
};
