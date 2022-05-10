const api = require("./api");

class UserService {
  constructor(apiKey) {
    this.api = api(apiKey);
  }

  async createUser(userId, displayName) {
    const { data } = await api.post("/v3/session", {
      userId,
      deviceId: userId,
      displayName,
    });
    return data;
  }
}

module.exports = UserService;
