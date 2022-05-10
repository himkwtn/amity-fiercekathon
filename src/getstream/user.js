const StreamChat = require("stream-chat").StreamChat;

class GetStreamUser {
  constructor(key, secret) {
    const client = StreamChat.getInstance(key, secret);
    this.client = client;
  }
  async queryUsers() {
    const { users } = await this.client.queryUsers(
      { created_at: { $gt: "2019-10-12T07:20:50.52Z" } },
      { id: 1 },
      { limit: 100 }
    );
    return users.map((user) => ({
      id: user.id,
      displayName: user.name,
    }));
  }
}
