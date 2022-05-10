const api = require("./api");

class PostService {
  constructor(apiKey, accessToken) {
    this.api = api(apiKey, accessToken);
  }

  async createPost(text, postId) {
    const { data } = await this.api.post("/api/v4/posts", {
      data: { text },
      postId,
    });
    return data;
  }
}

module.exports = PostService;
