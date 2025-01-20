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
const OrganisationAdminService = require("../db/services/orgAdminService");
const { header } = require("express-validator");


const orgAuth = async(req,res,next)=>{
    try{
        const headerToken = req.header("Authorization").replace("Bearer ", "");
        //console.log('headerToken:',headerToken);
        
        if(!headerToken){
            throw new ValidationError(ValidationMsgs.HeaderTokenAbsent);
        }
        const decoded = jwt.verify(headerToken, process.env.JWT_ORGANISATION_PK);
        //console.log('decoded:',decoded);
        
        if(!decoded){
            throw new ValidationError(ValidationMsgs.DecodedTokenFail);
        }
        const orgAdmin = await OrganisationAdminService.getUserByIdAndToken(decoded[TableFields.orgId],headerToken)
                         .withBasicInfoOrg()
                         .execute();
        if(!orgAdmin){
            throw new ValidationError();
        }
        req.orgId = orgAdmin[TableFields.ID];
        next();        

    }
    catch(e){
        if (!(e instanceof ValidationError)) {
            console.log(e);
        }
        res.status(ResponseStatus.Unauthorized).send(Util.getErrorMessageFromString(ValidationMsgs.AuthFail));
    }
}

module.exports = orgAuth;