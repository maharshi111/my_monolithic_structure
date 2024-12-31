const {
    TranscribeService,
    defaultBucket
} = require('./metadata')

// Usage:

exports.convertAndSaveText = async (audioFileS3URL = "", textFileS3Key = "") => {
    if (audioFileS3URL && textFileS3Key) {
        try {
            await TranscribeService.startTranscriptionJob({
                TranscriptionJobName: "" + new Date().getTime(),
                LanguageCode: "en-US",
                MediaFormat: "mp3",
                Media: {
                    MediaFileUri: audioFileS3URL,
                },
                OutputBucketName: defaultBucket,
                OutputKey: textFileS3Key,
            }).promise()
        } catch (e) {
            printError(e)
        }
    }
}
const printError = (err) => {
    console.log(err)
}