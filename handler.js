"use strict";

const PostService = require("./post");
const UserService = require("./user");

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

module.exports.createUser = async (event) => {
  try {
    const { apiKey, userId, displayName } = JSON.parse(event.body);
    console.log(userId, displayName);
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

module.exports.createPost = async (event) => {
  const { apiKey, userId, postId, text } = JSON.parse(event.body);
  const userService = new UserService(apiKey);
  const { accessToken } = await userService.createUser(userId);
  const postService = new PostService(apiKey, accessToken);
  const result = await postService.createPost(text, postId);
  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
