"use strict";

const PostService = require("./src/asc/post");
const { sendMessage } = require("./src/queue");
const UserService = require("./src/asc/user");
const GetStreamUser = require("./src/getstream/user");
const GetStreamPost = require("./src/getstream/post");

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

module.exports.migrate = async (event) => {
  const { key, secret, appId, ascKey } = event.queryStringParameters;
  const getStream = { key, secret, appId };
  const asc = { key: ascKey };
  const queue = process.env.MIGRATE_QUEUE;
  await sendMessage(queue, { asc, getStream });
  return {
    statusCode: 200,
    body: "Migrating to ASC!",
  };
};

module.exports.migrateWorker = async (event) => {
  try {
    for (const message of event.Records) {
      console.log(message);
      const { getStream, asc } = JSON.parse(message.body);
      console.log({ getStream, asc });
      const userService = new GetStreamUser(
        getStream.key,
        getStream.secret,
        getStream.appId
      );
      const postService = new GetStreamPost(
        getStream.key,
        getStream.secret,
        getStream.appId
      );
      const users = await userService.queryUsers();
      const userQueue = process.env.USER_QUEUE;
      const postQueue = process.env.POST_QUEUE;
      console.log({ userQueue, postQueue });
      for (const user of users) {
        await sendMessage(userQueue, { apiKey: asc.key, ...user });
        const posts = await postService.queryPost(user.userId);
        for (const post of posts) {
          await sendMessage(postQueue, {
            apiKey: asc.key,
            userId: user.userId,
            ...post,
          });
        }
      }
    }
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

module.exports.createPostWorker = async (event) => {
  for (const message of event.Records) {
    const { apiKey, userId, postId, text, attachments } = JSON.parse(
      message.body
    );
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
  }
};
