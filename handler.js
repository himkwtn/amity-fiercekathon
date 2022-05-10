"use strict";

const PostService = require("./src/asc/post");
const { sendMessage } = require("./src/queue");
const UserService = require("./src/asc/user");

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v3.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports.migrateDemo = async (event) => {
  const getStream = { key: "", secret: "", appId: "" };
  const asc = { key: "" };
};

module.exports.createUser = async (event) => {
  try {
    const { apiKey, userId, displayName } = JSON.parse(event.body);
    const userService = new UserService(apiKey);
    const result = await userService.createUser(userId, displayName);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};
module.exports.createUserWorker = async (event) => {
  try {
    for (const message of event.Records) {
      const { apiKey, userId, displayName } = JSON.parse(message.body);
      const userService = new UserService(apiKey);
      const result = await userService.createUser(userId, displayName);
      console.log(result);
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};
module.exports.createUserQueue = async (event) => {
  try {
    const { apiKey, userId, displayName } = JSON.parse(event.body);
    const result = await sendMessage({ apiKey, userId, displayName });
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const createPost = async (event) => {
  const { apiKey, userId, postId, text, attachments } = JSON.parse(event.body);
  const userService = new UserService(apiKey);
  const { accessToken } = await userService.createUser(userId);
  const postService = new PostService(apiKey, accessToken);
  const result = await postService.createPost(
    text,
    postId,
    attachments?.images
  );
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};

module.exports.createPost = createPost;

module.exports.createPostWorker = async (event) => {
  for (const message of event.Records) {
    await createPost(message);
  }
};
