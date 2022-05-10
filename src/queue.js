const AWS = require("aws-sdk");
const sqs = new AWS.SQS({
  apiVersion: "latest",
  region: process.env.AWS_REGION,
});

exports.sendMessage = async function (queue, message) {
  // Send a message into SQS
  await sqs
    .sendMessage({
      QueueUrl: queue,
      // Any message data we want to send
      MessageBody: JSON.stringify(message),
    })
    .promise();
};
