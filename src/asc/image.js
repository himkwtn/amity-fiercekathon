const { default: axios } = require("axios");
const fs = require("fs");
const api = require("./api");

class ImageService {
  constructor(apiKey, accessToken) {
    this.api = api(apiKey, accessToken);
  }
  async upload(url) {
    const { data } = await axios.get(url, { responseType: "stream" });
    const buffer = await stream2buffer(data);
    const formData = new URLSearchParams();
    formData.append("file", buffer);
    formData.append("fullImage", true);
    const { data: fileData } = await this.api.post("/api/v3/files", formData, {
      headers: { "content-type": "application/json" },
    });
    const { fileId } = fileData[0];
    return fileId;
  }
}

function stream2buffer(stream) {
  return new Promise((resolve, reject) => {
    const _buf = [];

    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(err));
  });
}

module.exports = ImageService;
