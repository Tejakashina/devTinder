const { SendEmailCommand} = require("@aws-sdk/client-ses");

const {sesClient} = require("../config/ses");

const createSendEmailCommand = (toAddress, fromAddress,subject,body) => {
    return new SendEmailCommand({
        Destination: {
            CcAddresses: [
            ],
            ToAddresses: [
                toAddress,
            ],
        },
        Message: {

            Body: {
    
                Html: {
                    Charset: "UTF-8",
                    Data: body,
                },
                Text: {
                    Charset: "UTF-8",
                    Data: body.replace(/<[^>]*>/g, ""),
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: subject,
            },
        },
        Source: fromAddress,
        ReplyToAddresses: [
        
        ],
    });
};
const run = async (toAddress, subject, body) => {
    console.log("Sending email to:", toAddress);
    const sendEmailCommand = createSendEmailCommand(
        toAddress,
        "noreply@tinderdev.in",
        subject,
        body
    );

    try {

        const response = await sesClient.send(sendEmailCommand);

        console.log("SES SUCCESS:", response);

        return response;
    } catch (caught) {
        if (caught instanceof Error && caught.name === "MessageRejected") {
            const messageRejectedError = caught;
            return messageRejectedError;
        }
        throw caught;
    }
};
module.exports = { run };
