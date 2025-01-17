const moment = require("moment");

const fs = require("fs");
const Util = class {
  static isEmail(email) {
    const re = /^[A-Za-z0-9\._%+\-]+@[A-Za-z0-9\.\-]+\.[A-Za-z]{2,}$/;
    return re.test(String(email));
  }
  static subscriptionStartInvalid(value) {
    let trialDate = new Date().toISOString();
    let arr = trialDate.split("T");
    let currDate = arr[0];
    let year = currDate.split("-");
    let num = +year[0];
    //console.log("this is value", value);
    const grantedDate = new Date(value);
    //console.log("grantedDate", grantedDate);

    const minDate = new Date(`${num}-01-01`);
    //console.log("minDate", minDate);

    const maxDate = new Date(`${num}-12-31`);

    let s = "";

    if (grantedDate < minDate) {
      s = `The date must not be before than January 01,${num}`;
      return { success: false, msg: s };
    }
    if (grantedDate > maxDate) {
      s = `The date must not be after December 31,${num}`;
      return { success: false, msg: s };
    }
    return { success: true };
  }

  static isUrlValid(userInput) {
    //  var res = userInput.match(/^(http(s)?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/);
    var res = userInput.match(/^(http(s)?:\/\/)?(www\.)?[-a-zA-Z0-9:%._\+~#=]{2,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9:%_\+.~#?&//=]*)$/);

    if(res == null)
        return false;
    else
        return true;
    }

    static isDigit(value){
        var reg = /^\d+$/;
        return reg.test(value);
    }
    static isAlpha(value){
        var reg = /^[a-zA-Z ]*$/;
        return reg.test(value);
    }
    static isDate(value){
        var reg = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
        return reg.test(value);
    }
    static ValidationMsgsLength(reqBody,maxlen,minlen,fieldName){
        let msg="";
        //console.log('inside static method');
        
        // console.log(reqBody);
        // console.log(reqBody.length);
        
        
        if(reqBody.trim().length<minlen){
             msg= `The minimum length allowed for ${fieldName} field is ${minlen}`;
            return {flag:false,message:msg};
        }
        else if(reqBody.trim().length>maxlen){
            msg = `The maximum length allowed for ${fieldName} field is ${maxlen}`;
            return {flag:false,message:msg};
        }
        else{
            return {flag:true};
        }
    }
    static isEmpty(field){
        if(!field){
            return false;
        }
    }
    static isAlphaNumeric(value){
        var reg = /^[a-zA-Z0-9]+$/;
        return reg.test(value);
    }
    static DateOfBirthInvalid(value){
        let trialDate = new Date().toISOString();
        let arr = trialDate.split('T');
        let currDate = arr[0];
        let year =  currDate.split('-');
        let num = +(year[0]);
        let minDob = `${num -70}-01-01`;
        let maxDob = `${num-20}-12-31`;
        
        const grantedDate = new Date(value);
        const minDate = new Date(`${minDob}`); 
        const maxDate = new Date(`${maxDob}`); 

        let s="";
    
        if (grantedDate < minDate) {
            // throw new Error(`The date must not be before than ${minDob}`);
            s = `The date must not be before than ${minDob}`;
            return{success:false,msg:s};
        }
        if (grantedDate > maxDate) {
            //throw new Error(`The date must not be after  ${maxDob}`);
            s=`The date must not be after  ${maxDob}`;
            return{success:false,msg:s};
        }
        return{success:true};
    }
    static joiningDateInvalid(value){
        let trialDate = new Date().toISOString();
        let arr = trialDate.split('T');
        let currDate = arr[0];
        let year =  currDate.split('-');
        let num = +(year[0]);
        let min =  num-50;
        let leastDate = `${min}-01-01`;
        let maxiumDate = `${num}-12-31`;
        
        const grantedDate = new Date(value);
        const minDate = new Date(`${leastDate}`); 
        const maxDate = new Date(`${maxiumDate}`); 

        let s="";
        
    
        if (grantedDate < minDate) {
          s = `The date must not be before than ${leastDate}`;
          return{success:false,msg:s};
        }
        if (grantedDate > maxDate) {
           s = `The date must not be after  ${maxiumDate}`;
           return{success:false,msg:s};
        }
        return{success:true};
    }

  /////###############################################################################////////////////
  static isImageFile(fileOriginalName) {
    return fileOriginalName
      .toLocaleLowerCase()
      .match(
        /\.(jpg|jpeg|jpe|jif|jfif|jfi|png|bmp|webp|tiff|tif|dib|svg|svgz)$/
      ) == undefined
      ? false
      : true;
  }
  static isExcelFile(fileOriginalName) {
    return fileOriginalName.toLocaleLowerCase().match(/\.(xlsx|xls)$/) ==
      undefined
      ? false
      : true;
  }
  static getErrorMessage(mongooseException) {
    try {
      const mainJSONKeys = Object.keys(mongooseException.errors);
      if (mongooseException.errors[mainJSONKeys[0]].errors) {
        const jsonKeys = Object.keys(
          mongooseException.errors[mainJSONKeys[0]].errors
        );
        return {
          error:
            mongooseException.errors[mainJSONKeys[0]].errors[jsonKeys[0]]
              .properties.message,
        };
      } else {
        return {
          error: mongooseException.errors[mainJSONKeys[0]].message,
        };
      }
    } catch (e) {
      return {
        error: mongooseException.message,
      };
    }
  }

  static getErrorMessageFromString(message) {
    return {
      error: message,
    };
  }

  static getBaseURL() {
    let baseURL = process.env.HOST;
    if (Util.useProductionSettings() == false) {
      baseURL += ":" + process.env.PORT;
    }
    return baseURL;
  }

  static useProductionSettings() {
    return Util.parseBoolean(process.env.isProduction);
  }

  static parseBoolean(b) {
    return (b + "").toLowerCase() == "true";
  }

  static escapeRegex(textStr = "") {
    return textStr.replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&");
  }

  static wrapWithRegexQry(textStr = "") {
    return new RegExp(Util.escapeRegex(textStr));
  }

  static generateRandomFileName(filename) {
    var ext = filename.split(".").pop();
    var random = Math.floor(Math.random() * 9000000000000000);
    let timestamp = new Date().getTime().toString();
    filename = timestamp + "_" + random + "." + ext;
    return filename;
  }

  static tokenMaxAge() {
    return new Date("2099-12-31");
  }

  static removeTime(dateObj) {
    if (!dateObj) {
      return;
    }
    let year = dateObj.getUTCFullYear();
    let month = dateObj.getUTCMonth() + 1;
    let dt = dateObj.getUTCDate();
    if (dt < 10) {
      dt = "0" + dt;
    }
    if (month < 10) {
      month = "0" + month;
    }
    return year + "-" + month + "-" + dt;
  }

  static generateRandomPassword(length) {
    var result = "";
    // var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // var characters       = '0123456789';
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static addZero = (i) => {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  };

  static getSystemDateUTC = (d) => {
    let currentDate = new Date(new Date().toUTCString());
    return (
      currentDate.getFullYear() +
      "-" +
      this.addZero(currentDate.getMonth() + 1) +
      "-" +
      this.addZero(currentDate.getDate())
    );
  };

  static getSystemDateTimeUTC = () => {
    return new Date(new Date().toUTCString());
  };

  static getDateTimeMST = () => {
    return new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "America/Denver",
      })
    );
  };

  static getCurrentUTCTime = () => {
    const now = new Date().getUTCMilliseconds();
    dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
  };

  static msToTime(duration) {
    console.log(duration);
    var minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return hours + ":" + minutes;
  }

  static getFileContent(filePath) {
    let content = "";
    if (fs.existsSync(filePath)) {
      content = fs.readFileSync(filePath);
    }
    return content;
  }

  static isValidMobileNumber(v) {
    return v.length >= 9 && v.length <= 12;
  }

  static trimLeadingZeros(stringValue) {
    if (stringValue) {
      try {
        stringValue = stringValue.replace(/^0+/, "");
      } catch (error) {
        throw error;
      }
    }
    return stringValue;
  }

  static populateMissingDates = (dataObject, startDate, endDate) => {
    dataObject = dataObject.map((val) => {
      return { ...val, createdAt: moment(val.createdAt).format("YYYY-MM-DD") };
    });
    let startMonth = parseInt(moment(startDate).format("MM"));
    let endMonth = parseInt(moment(endDate).format("MM"));
    let startYear = parseInt(moment(endDate).format("YYYY"));
    let endYear = parseInt(moment(endDate).format("YYYY"));
    // console.log(startMonth,endMonth)
    if (startMonth === endMonth) {
      const allDates = Array.from(
        new Set(
          dataObject.map((entry) =>
            moment(entry.createdAt).format("YYYY-MM-DD")
          )
        )
      );
      // Get the unique months from the dataObject
      const uniqueMonths = Array.from(
        new Set(
          allDates.map((date) =>
            moment(date).format("YYYY-MM-DD").toString().slice(0, 7)
          )
        )
      );
      // console.log(parseInt(moment(endDate).format("D")))

      // Populate missing dates for each month in the dataObject with zeros
      uniqueMonths.forEach((month) => {
        const monthDates = allDates.filter((date) =>
          moment(date.toString().startsWith(month)).format("YYYY-MM-DD")
        );
        // for (let i = parseInt(moment(startDate).format("D")); i <= parseInt(moment(endDate).format("D")); i++) {
        //     const day = i < 10 ? `0${i}` : `${i}`
        //     const date = `${startYear}-${startMonth}-${day}`
        //     console.log("monthDates",monthDates,"date",date)
        //     if (!monthDates.includes(date)) {
        //     dataObject.push({createdAt: date,emojiId:0,title:""})
        //     }
        // }
        for (
          let i = parseInt(moment(startDate).format("D"));
          i <= parseInt(moment(endDate).format("D"));
          i++
        ) {
          const day = i < 10 ? `0${i}` : `${i}`;
          const date = `${startYear}-${startMonth}-${day}`;

          if (!monthDates.includes(moment(date).format("YYYY-MM-DD"))) {
            dataObject.push({ createdAt: date, emojiId: 0, title: "" });
          }
        }
      });
    } else {
      const monthEnd = moment(startDate).endOf("month").format("YYYY-MM-DD");
      const monthStart = moment(endDate).startOf("month").format("YYYY-MM-DD");
      // console.log("monthEnd",monthEnd,"monthStart",monthStart)

      const allDates = Array.from(
        new Set(
          dataObject.map((entry) =>
            moment(entry.createdAt).format("YYYY-MM-DD")
          )
        )
      );
      // Get the unique months from the dataObject
      const uniqueMonths = Array.from(
        new Set(
          allDates.map((date) =>
            moment(date).format("YYYY-MM-DD").toString().slice(0, 7)
          )
        )
      );
      // console.log(parseInt(moment(endDate).format("D")))

      // Populate missing dates for each month in the dataObject with zeros
      uniqueMonths.forEach((month) => {
        const monthDates = allDates.filter((date) =>
          date.toString().startsWith(month)
        );
        // for (let i = parseInt(moment(startDate).format("D")); i <= parseInt(moment(monthEnd).format("D")); i++) {
        //     const day = i < 10 ? `0${i}` : `${i}`
        //     const month = startMonth < 10 ? `0${startMonth}` : `${startMonth}`

        //     const date = `${startYear}-${month}-${day}`
        //     // console.log(`${month}-${day}`)
        //     // console.log(date)
        //     if (!monthDates.includes(date)) {
        //         dataObject.push({createdAt: date,emojiId:0,title:""})
        //         }
        // }
        for (
          let i = parseInt(moment(startDate).format("D"));
          i <= parseInt(moment(monthEnd).format("D"));
          i++
        ) {
          const day = i < 10 ? `0${i}` : `${i}`;
          const month = startMonth < 10 ? `0${startMonth}` : `${startMonth}`;
          const date = `${startYear}-${month}-${day}`;

          if (!monthDates.includes(moment(date).format("YYYY-MM-DD"))) {
            dataObject.push({ createdAt: date, emojiId: 0, title: "" });
          }
        }
      });
      uniqueMonths.forEach((month) => {
        const monthDates = allDates.filter((date) =>
          date.toString().startsWith(month)
        );
        // console.log("dataObject",monthDates)

        // for (let i = parseInt(moment(monthStart).format("D")); i <= parseInt(moment(endDate).format("D")); i++) {
        //     const day = i < 10 ? `0${i}` : `${i}`
        //     const month = endMonth < 10 ? `0${endMonth}` : `${endMonth}`
        //     const date = `${endYear}-${month}-${day}`

        //     if (!monthDates.includes(date.toString())) {
        //         dataObject.push({createdAt: date,emojiId:0,title:""})
        //         }
        // }
        for (
          let i = parseInt(moment(monthStart).format("D"));
          i <= parseInt(moment(endDate).format("D"));
          i++
        ) {
          const day = i < 10 ? `0${i}` : `${i}`;
          const month = endMonth < 10 ? `0${endMonth}` : `${endMonth}`;
          const date = `${endYear}-${month}-${day}`;

          if (!monthDates.includes(moment(date).format("YYYY-MM-DD"))) {
            dataObject.push({ createdAt: date, emojiId: 0, title: "" });
          }
        }
      });
      // console.log("dataObject",dataObject)

      // uniqueMonths.forEach((month) => {
      //     const monthDates = allDates.filter((date) => moment(date.toString().startsWith(month)).format("YYYY-MM-DD"));
      //     for (let i = 1; i <= moment(month + '-01').daysInMonth(); i++) {
      //         const day = i < 10 ? `0${i}` : `${i}`;
      //         const date = `${month}-${day}`;
      //         if (!monthDates.includes(date)) {
      //             dataObject.push({ createdAt: date, emojiId: 0, title: "" });
      //         }
      //     }
      // });
    }

    // Sort dataObject based on dates
    return dataObject;
  };
};
module.exports = Util;
