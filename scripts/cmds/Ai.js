module.exports = {
  config: {
    name: "ai",
    aliases: ["gpt", "chatgpt", "gpt5"],
    version: "2.5",
    author: "chris st",
    countDown: 0,
    role: 0,
    shortDescription: "Chat with GPT-5",
    longDescription: "Talk with GPT-5 AI",
    category: "AI",
    guide: "Ai <message>"
  },

  onStart: async ({ api, event, args }) => {
    const user = await getUserName(api, event.senderID);
    const q = args.join(" ").trim();

    if (!q) {
      return api.sendMessage(
`╭── ⚠️ 𝗘𝗿𝗿𝗲𝘂𝗿 ───
│ 👤 ${user}
│
│ 💬 𝖴𝗍𝗂𝗅𝗂𝗌𝖾 Minato
│ 𝗌𝖺𝗇𝗌 𝗉𝗋é𝖿𝗂𝗑𝖾.
│
│ ✍️ 𝖤𝗑𝖾𝗆𝗉𝗅𝖾 :
│ Minato bonjour
╰──────────────────`,
        event.threadID,
        event.messageID
      );
    }

    return api.sendMessage(
`╭── 🚫 𝗔𝗰𝗰𝗲̀𝘀 𝗥𝗲𝗳𝘂𝘀𝗲́ ───
│ 👤 ${user}
│
│ 📡 𝖨𝗆𝗉𝗈𝗌𝗌𝗂𝖻𝗅𝖾
│ 𝖽'𝗎𝗍𝗂𝗅𝗂𝗌𝖾𝗋 "ai" 𝗂𝖼𝗂.
│
│ 💬 𝖤́𝖼𝗋𝗂𝗌 :
│ Minato + 𝗍𝖺 𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇
│
│ 🤖 𝖤𝗑𝖾𝗆𝗉𝗅𝖾 :
│ Minato comment ça va ?
╰──────────────────`,
      event.threadID,
      event.messageID
    );
  },

  onChat: async ({ api, event }) => {
    const body = (event.body || "").trim();
    const m = body.match(/^(ai)\s*(.*)/i);

    if (!m) return;

    const user = await getUserName(api, event.senderID);

    if (!m[2] || m[2].trim() === "") {
      return api.sendMessage(
`╭── ⚠️ 𝗘𝗿𝗿𝗲𝘂𝗿 ───
│ 👤 ${user}
│
│ 💬 𝖴𝗍𝗂𝗅𝗂𝗌𝖾 Minato
│ 𝗌𝖺𝗇𝗌 𝗉𝗋é𝖿𝗂𝗑𝖾.
│
│ ✍️ 𝖤𝗑𝖾𝗆𝗉𝗅𝖾 :
│ Minato salut
╰──────────────────`,
        event.threadID,
        event.messageID
      );
    }

    return api.sendMessage(
`╭── 🚫 𝗔𝗰𝗰𝗲̀𝘀 𝗥𝗲𝗳𝘂𝘀𝗲́ ───
│ 👤 ${user}
│
│ 📡 𝖨𝗆𝗉𝗈𝗌𝗌𝗂𝖻𝗅𝖾
│ 𝖽'𝗎𝗍𝗂𝗅𝗂𝗌𝖾𝗋 "ai" 𝗂𝖼𝗂.
│
│ 💬 𝖤́𝖼𝗋𝗂𝗌 :
│ Minato + 𝗍𝖺 𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇
│
│ 🤖 𝖤𝗑𝖾𝗆𝗉𝗅𝖾 :
│ Minato aide moi
╰──────────────────`,
      event.threadID,
      event.messageID
    );
  }
};

async function getUserName(api, userID) {
  try {
    const info = await api.getUserInfo(userID);
    return info[userID]?.name || "Utilisateur";
  } catch {
    return "Utilisateur";
  }
}
