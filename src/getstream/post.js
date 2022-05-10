const { connect } = require("getstream");

class GetStreamPost {
  constructor(key, secret, appId) {
    const client = connect(key, secret, appId, {
      location: "us-east",
      timeout: 15000,
    });
    this.client = client;
  }

  async queryPost(userId) {
    const user = this.client.feed("user", userId);
    const { results } = await user.get({ limit: 100, offset: 0 });
    const activities = results.map((result) => {
      const { id, text } = result;
      return { postId: id, text };
    });
    return activities;
  }
}

module.exports = GetStreamPost;
