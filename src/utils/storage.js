const Util = require("./util");
const S3Lib = require("./metadata");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

exports.Folders = S3Lib.Folders;

exports.saveAudioFile = async (
    audioBase64String,
    saveFilePath,
    orifinalFileName
) => {
    let finalFileName = "";
    let tempFileName = await Util.generateRandomFileName(orifinalFileName);
    let buffer = Buffer.from(audioBase64String, 'base64');
    try {
        if (saveFilePath) {
            await createDirectories(saveFilePath);
            finalFileName = saveFilePath + "/" + tempFileName;
        } else {
            finalFileName = tempFileName;
        }
        await fs.writeFileSync(finalFileName, buffer);
        return tempFileName;
    } catch (e) {
        if (this.handlesError) {
            //To disable this: Call this method as addFile.call({handlesError:true})
            return {
                error: e
            };
        } else {
            console.log("File write error:", e);
            return "";
        }
    }
};

exports.saveCropImage = async (
    imgBase64String,
    saveFilePath,
    extension,
    orifinalFileName
) => {
    imgBase64String = imgBase64String.split(",");
    let finalFileName = "";
    let tempFileName = await Util.generateRandomFileName(orifinalFileName);
    let buffer = Buffer.from(imgBase64String[1], 'base64');
    try {
        if (saveFilePath) {
            await createDirectories(saveFilePath);
            finalFileName = saveFilePath + "/" + tempFileName;
        } else {
            finalFileName = tempFileName;
        }
        await fs.writeFileSync(finalFileName, buffer);
        return tempFileName;
    } catch (e) {
        if (this.handlesError) {
            //To disable this: Call this method as addFile.call({handlesError:true})
            return {
                error: e
            };
        } else {
            console.log("File write error:", e);
            return "";
        }
    }
};
exports.addFile = async (
    parentDir,
    orifinalFileName,
    file,
    shouldCompressIfImageSent = true
) => {
    if (!orifinalFileName || !file) return "";
    let finalFileName = "";
    var tempFileName = await Util.generateRandomFileName(orifinalFileName);
    if (shouldCompressIfImageSent == true && Util.isImageFile(tempFileName)) {
        try {
            let src = new sharp(file);
            await src.rotate();
            await src.resize({
                height: 1280,
                withoutEnlargement: true,
            });
            await src.flatten({
                background: {
                    r: 255,
                    g: 255,
                    b: 255
                }
            });
            await src.jpeg({
                quality: 50,
                progressive: true
            });
            file = await src.toBuffer();
            tempFileName =
                tempFileName.substr(0, tempFileName.lastIndexOf(".")) + ".jpg";
        } catch (e) {
            //Ignore, The original image file will be saved as it is.
        }
    }

    if (parentDir) {
        await createDirectories(parentDir);
        finalFileName = parentDir + "/" + tempFileName;
    } else {
        finalFileName = tempFileName;
    }
    try {
        await fs.writeFileSync(finalFileName, file);
        return tempFileName;
    } catch (e) {
        if (this.handlesError) {
            //To disable this: Call this method as addFile.call({handlesError:true})
            return {
                error: e
            };
        } else {
            console.log("File write error:", e);
            return "";
        }
    }
};
exports.removeFileById = async (parentDir, fileKey) => {
    if (!fileKey && !fileKey.contains('default')) return false;
    try {
        const ext = await fs.existsSync(parentDir + "/" + fileKey);
        if (ext) {
            await fs.unlinkSync(parentDir + "/" + fileKey);
        }
        return true;
    } catch (e) {
        if (this.handlesError) {
            //To disable this: Call this method as removeFileById.call({handlesError:true})
            return {
                error: e
            };
        } else {
            console.log(e);
            return false;
        }
    }
};
exports.copyFile = async (src, dest) => {
    if (!src || !dest) return false;
    try {
        const ext = await fs.existsSync(src);
        if (ext) {
            await fs.copyFileSync(src, dest);
        }
        return true;
    } catch (e) {
        if (this.handlesError) {
            //To disable this: Call this method as removeFileById.call({handlesError:true})
            return {
                error: e
            };
        } else {
            console.log(e);
            return false;
        }
    }
};
exports.getFile = (parentDir, fileKey) => {
    return new Promise(async (resolve, reject) => {
        try {
            let stream = await fs.readFileSync(parentDir + "/" + fileKey, "utf8");
            resolve(stream);
        } catch (e) {
            resolve();
        }
    });
};
exports.getUrl = (parentDir, key) => {
    if (key) return this.getBaseURL() + parentDir + "/" + key;
    else return "";
};
exports.getBaseURL = () => {
    return Util.getBaseURL() + "/";
};

async function createDirectories(pathname) {
    const __dirname = path.resolve();
    pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ""); // Remove leading directory markers, and remove ending /file-name.extension
    await fs.mkdirSync(
        path.resolve(__dirname, pathname), {
            recursive: true
        },
        (e) => {
            if (e) {
                console.error("Directory created error: ", e);
            }
        }
    );
}