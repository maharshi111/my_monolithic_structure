var iap = require('in-app-purchase');
const {
    ResponseFields,
    ResponseStatus,
    TableFields,
    Platforms,
    ResponseMessages
} = require("./constants")

iap.config({
    /* Configurations for HTTP request */
    requestDefaults: {
        /* Please refer to the request module documentation here: https://www.npmjs.com/package/request#requestoptions-callback */
    },


    /* Configurations for Apple */
    appleExcludeOldTransactions: false, // if you want to exclude old transaction, set this to true. Default is false
    applePassword: '7b7763475d714eb9a4a94ab463bcd2e7', // this comes from iTunes Connect (You need this to valiate subscriptions)

    /* Configurations for Google Service Account validation: You can validate with just packageName, productId, and purchaseToken */
    googleServiceAccount: {
        clientEmail: '',
        privateKey: '-----BEGIN PRIVATE KEY----------END PRIVATE KEY-----\n'
    },

    /* Configurations for Google Play */
    // googlePublicKeyPath: 'iap-sandbox', // this is the path to the directory containing iap-sanbox/iap-live files
    googlePublicKeyStrSandBox: '', // this is the google iap-sandbox public key string
    googlePublicKeyStrLive: '', // this is the google iap-live public key string
    googleAccToken: '', // optional, for Google Play subscriptions
    googleRefToken: '', // optional, for Google Play subscritions
    googleClientID: '', // optional, for Google Play subscriptions
    googleClientSecret: '', // optional, for Google Play subscriptions


    /* Configurations all platforms */
    test: false, // For Apple and Googl Play to force Sandbox validation only
    verbose: false // Output debug logs to stdout stream
});

exports.validateReceipt = async (model) => {
    let receiptData = model[TableFields.inAppPurchasedToken];
    if (model[TableFields.platform] != Platforms.iOS) {
        receiptData = {
            packageName: '',
            productId: model[TableFields.productId],
            purchaseToken: model[TableFields.inAppPurchasedToken],
            subscription: true
        }
    }
    return await iap.setup()
        .then(async () => {
            return await iap.validate(receiptData).then(onSuccess).catch(onError);
        })
        .catch((error) => {
            return {
                [ResponseFields.status]: ResponseStatus.Failed,
                [ResponseFields.message]: error,
            }
        });
}



function onSuccess(validatedData) {
    return {
        [ResponseFields.status]: ResponseStatus.Success,
        [ResponseFields.message]: ResponseMessages.Ok,
        [ResponseFields.result]: validatedData
    }
}

function onError(error) {
    return {
        [ResponseFields.status]: ResponseStatus.Failed,
        [ResponseFields.message]: error,
    }
}