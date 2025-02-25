const {TableNames} = require("../utils/constants");
const allServices = [
    [TableNames.Organisation, require("./services/OrganisationService").deleteMyReferences],
    [TableNames.Employee, require("./services/EmployeeService").deleteMyReferences],
    [TableNames.Department, require("./services/DepartmentService").deleteMyReferences],
];
const mCascadeDelete = async function (tableName, ...deletedRecordIds) {
    console.log('hello cascade');
    
    deletedRecordIds = deletedRecordIds.filter((a) => a != undefined);
    if (deletedRecordIds.length > 0) {
        console.log('++>',this.ignoreSelfCall);
        if (this.ignoreSelfCall) {
            //To activate this, you need to call this function using .apply({ignoreSelfCall:true}) or .call({ignoreSelfCall:true}) or .bind({ignoreSelfCall:true})
           
            allServices.forEach(async (a) => {
                if (a[0] != tableName) {
                    console.log('if part');
                    try {
                        await a[1](mCascadeDelete, tableName, ...deletedRecordIds);
                    } catch (e) {
                        console.log("CascadeDelete Error (1) ", "(" + a[0] + ")", e);
                        throw e;
                    }
                }
            });
        } else {
            allServices.forEach(async (a) => {
                try {
                    console.log('else part');
                    console.log('a[1]',a[1]);
                    
                    await a[1](mCascadeDelete, tableName, ...deletedRecordIds);
                } catch (e) {
                    console.log("CascadeDelete Error (2) ", "(" + a[0] + ")", e);
                    throw e;
                }
            });
        }
    }
};
exports.cascadeDelete = mCascadeDelete;


