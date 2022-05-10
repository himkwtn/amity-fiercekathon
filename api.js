const axios = require("axios").default;
const BASE_URL = "https://api.sg.amity.co";

module.exports = (apiKey, accessToken) => {
  const headers = { "x-api-key": apiKey };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return axios.create({ baseURL: BASE_URL, headers });
};
