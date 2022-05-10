const api = require("./api");
const ImageService = require("./image");

class PostService {
  constructor(apiKey, accessToken) {
    this.api = api(apiKey, accessToken);
    this.imageService = new ImageService(apiKey, accessToken);
  }

  async createPost(text, postId, images = []) {
    const fileIds = await Promise.all(
      images.map((img) => this.imageService.upload(img))
    );
    const attachments = fileIds.map((fileId) => ({ type: "image", fileId }));
    const { data } = await this.api.post("/api/v4/posts", {
      data: { text },
      postId,
      attachments,
    });
    return data;
  }
}

module.exports = PostService;
