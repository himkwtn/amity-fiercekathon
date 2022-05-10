const api = require("./api");

class PostService {
  constructor(apiKey, accessToken) {
    this.api = api(apiKey, accessToken);
  }

  async createPost(text) {
    const { data } = await api.post("/v4/posts", {
      data: { text },
    });
    return data;
  }
}

module.exports = PostService;
