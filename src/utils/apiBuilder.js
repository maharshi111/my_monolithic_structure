const express = require("express");
// const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
// const collegeAuth = require("../middleware/collegeAuth");
const Util = require("../utils/util");
const { ApiResponseCode, ResponseStatus } = require("../utils/constants");
const ValidationError = require("../utils/ValidationError");
const superAdminAuth = require("../middleware/superAdminAuth");
const organisationAuth = require('../middleware/orgAdminAuth');
class API {
  static configRoute(root) {
    let router = new express.Router();
    return new PathBuilder(root, router);
  }
}

const MethodBuilder = class {
  constructor(root, subPath, router) {
    this.asGET = function (methodToExecute) {
      return new Builder("get", root, subPath, methodToExecute, router);
    };

    this.asPOST = function (methodToExecute) {
      return new Builder("post", root, subPath, methodToExecute, router);
    };

    this.asDELETE = function (methodToExecute) {
      return new Builder("delete", root, subPath, methodToExecute, router);
    };

    this.asUPDATE = function (methodToExecute) {
      return new Builder("patch", root, subPath, methodToExecute, router);
    };
  }
};

const PathBuilder = class {
  constructor(root, router) {
    this.addPath = function (subPath) {
      return new MethodBuilder(root, subPath, router);
    };
    this.getRouter = () => {
      return router;
    };
    this.changeRoot = (newRoot) => {
      root = newRoot;
      return this;
    };
  }
};

const Builder = class {
  constructor(
    methodType,
    root,
    subPath,
    executer,
    router,
    useAuthMiddleware,
    duplicateErrorHandler,
    middlewaresList = [],
    useAdminAuth = false,
    useCollegeAuth = false,
    useSuperAdminAuth = false,
    useOrganisationAuth = false
  ) {
    // this.useSocketAPIAuth = () => {
    //     return new Builder(
    //         methodType,
    //         root,
    //         subPath,
    //         executer,
    //         router,
    //         useAuthMiddleware,
    //         duplicateErrorHandler,
    //         middlewaresList,
    //         useAdminAuth,

    //     );
    // };

    this.useAdminAuth = () => {
      return new Builder(
        methodType,
        root,
        subPath,
        executer,
        router,
        false,
        duplicateErrorHandler,
        middlewaresList,
        true,
        useCollegeAuth,
        useSuperAdminAuth
      );
    };

    this.useCollegeAuth = () => {
      return new Builder(
        methodType,
        root,
        subPath,
        executer,
        router,
        true,
        duplicateErrorHandler,
        middlewaresList,
        false,
        true,
        useSuperAdminAuth
      );
    };

    this.useSuperAdminAuth = () => {
        return new Builder(
          methodType,
          root,
          subPath,
          executer,
          router,
          false,
          duplicateErrorHandler,
          middlewaresList,
          useAdminAuth,
          useCollegeAuth,
          true
        );
      };


      this.useOrganisationAuth = () => {
        return new Builder(
          methodType,
          root,
          subPath,
          executer,
          router,
          false,
          duplicateErrorHandler,
          middlewaresList,
          useAdminAuth,
          useCollegeAuth,
          useSuperAdminAuth,
          true
        );
      };
    // this.useAuthForGetRequest = () => {
    //     return new Builder(
    //         methodType,
    //         root,
    //         subPath,
    //         executer,
    //         router,
    //         false,
    //         duplicateErrorHandler,
    //         middlewaresList,
    //         false,
    //         false,
    //         true
    //     );
    // };

    this.setDuplicateErrorHandler = (mDuplicateErrorHandler) => {
      return new Builder(
        methodType,
        root,
        subPath,
        executer,
        router,
        useAuthMiddleware,
        mDuplicateErrorHandler,
        middlewaresList,
        useAdminAuth
      );
    };

    this.userMiddlewares = (...middlewares) => {
      middlewaresList = [...middlewares];
      return new Builder(
        methodType,
        root,
        subPath,
        executer,
        router,
        useAuthMiddleware,
        duplicateErrorHandler,
        middlewaresList,
        useAdminAuth,
        useSocketAPIAuth
      );
    };

    this.build = () => {
      let controller = async (req, res) => {
        try {
            console.log('inside controller');
            
          let response = await executer(req, res);
          res.status(ResponseStatus.Success).send(response);
        } catch (e) {
          if (e && duplicateErrorHandler) {
            res
              .status(ResponseStatus.InternalServerError)
              .send(Util.getErrorMessageFromString(duplicateErrorHandler(e)));
          } else {
            if (e && e.name != ValidationError.name) {
              console.log(e);
            }
            res
              .status(ResponseStatus.InternalServerError)
              .send(Util.getErrorMessage(e));
          }
        }
      };
      if (useAuthMiddleware) {
        router[methodType](
          root + subPath,
          collegeAuth,
          ...middlewaresList,
          controller
        );
      } else if (useAdminAuth) {
        router[methodType](
          root + subPath,
          adminAuth,
          ...middlewaresList,
          controller
        );
      } 
      else if(useSuperAdminAuth){
        router[methodType](root + subPath,superAdminAuth, ...middlewaresList,controller);
      }
      else if(useOrganisationAuth){
        router[methodType](root + subPath,organisationAuth, ...middlewaresList,controller);  
      }
      else {
        router[methodType](root + subPath, ...middlewaresList, controller);
      }
      return new PathBuilder(root, router);
    };
  }
};

module.exports = API;
