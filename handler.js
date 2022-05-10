"use strict";

const axios = require("axios").default;

const API_KEY = "axios.create({ baseURL: BASE_URL });";

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
  const body = JSON.parse(event.body);
  const { data } = await axios.post(`${BASE_URL}/v1/device`, body, {
    headers: { "x-api-key": API_KEY },
  });
  console.log(data);
  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
