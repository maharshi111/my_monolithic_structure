const jwt = require("jsonwebtoken");
const {
    ValidationMsgs,
    TableFields,
    UserTypes,
    InterfaceTypes,
    ResponseStatus,
    JWTConstants,
    AuthTypes,
} = require("../utils/constants");
const Util = require("../utils/util");
const ValidationError = require("../utils/ValidationError");
const SuperAdminService = require("../db/services/SuperAdminServices");
const { header } = require("express-validator");

const superAdminAuth = async (req, res, next) => {
    try {
        //console.log('inside middleware');
        
        const headerToken = req.header("Authorization").replace("Bearer ", "");
        //console.log(headerToken);
        
        if(!headerToken){
            throw new ValidationError(ValidationMsgs.HeaderTokenAbsent);
        }
        const decoded = jwt.verify(headerToken, process.env.JWT_ADMIN_PK);
        //console.log(decoded);
        if(!decoded){
            throw new ValidationError(ValidationMsgs.DecodedTokenFail);
        }
        const superAdmin = await SuperAdminService.getUserByIdAndToken(decoded.superAdminId, headerToken)
        .withBasicInfo()
        .withPassword()
        .execute();
        //console.log('this is super admin',superAdmin);
        
        if (!superAdmin) {
            throw new ValidationError();
        }
        req.superAdminId = superAdmin[TableFields.ID];
        //console.log(req.superAdminId); 
        next();

    }
    catch (e) {
        if (!(e instanceof ValidationError)) {
            console.log(e);
        }
        //Error due to:
        // - No token in header  OR
        // - Token not exists in the database
        res.status(ResponseStatus.Unauthorized).send(Util.getErrorMessageFromString(ValidationMsgs.AuthFail));
    }

}



       // ##########################################################################################
    //     const token = req.cookies.uid;
    //     if(!token){
    //         res.redirect('/superAdmin/login');
    //     //    throw new Error('Super Admin not authenticated');
    //         throw new ValidationError();          
    //     }
    //     const decodedtoken = jwt.verify(token,process.env.JWT_ADMIN_PK);
    //     if(!decodedtoken){
    //         res.redirect('/superAdmin/login');
    //         //throw new Error('not authenticated due to wrong decoded token')
    //         throw new ValidationError();          
    //     }
    //     req.superAdminId = decodedtoken.superAdminId;
    //     next();

    // } 
   
module.exports = superAdminAuth;
