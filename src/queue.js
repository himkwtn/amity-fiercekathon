const AWS = require("aws-sdk");
const sqs = new AWS.SQS({
  apiVersion: "latest",
  region: process.env.AWS_REGION,
});

exports.sendMessage = async function (message) {
  // Send a message into SQS
  await sqs
    .sendMessage({
      QueueUrl: process.env.QUEUE_URL,
      // Any message data we want to send
      MessageBody: JSON.stringify(message),
    })
    .promise();
};
