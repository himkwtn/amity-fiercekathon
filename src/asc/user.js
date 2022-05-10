const api = require("./api");

class UserService {
  constructor(apiKey) {
    this.api = api(apiKey);
  }

  async createUser(userId, displayName) {
    const { data } = await this.api.post("/api/v3/sessions", {
      userId,
      deviceId: userId,
      displayName: displayName ?? userId,
    });
    return data;
  }
}

module.exports = UserService;
