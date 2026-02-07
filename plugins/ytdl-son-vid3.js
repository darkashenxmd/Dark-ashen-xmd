const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');


cmd({
    pattern: "song3",
    react: "🎵",
    desc: "Download YouTube MP3",
    category: "download",
    use: ".song <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ What song do you want to download?");

        const search = await yts(q);
        if (!search.videos.length) return reply("❌ No results found for your query.");

        const data = search.videos[0];
        const ytUrl = data.url;

        const api = `https://gtech-api-xtp1.onrender.com/api/audio/yt?apikey=APIKEY&url=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.media?.audio_url) {
            return reply("❌ Unable to download the song. Please try another one!");
        }

        const result = apiRes.result.media;

        const caption = `
🎵 *ꜱᴏɴɢ ᴅᴏᴡɴʟᴏᴅᴇʀ.* 📥

📑 *ᴛɪᴛʟᴇʀ:* ${data.title}
⏱️ *ᴅᴜʀᴀᴛɪᴏɴ:* ${data.timestamp}
📆 *ᴜᴘʟᴏᴀᴅᴇᴅ:* ${data.ago}
📊 *ᴠɪᴇᴡꜱ:* ${data.views}
🔗 *ʟɪɴᴋ:* ${data.url}

🔢 *ʀᴇᴘʟʏ ʙᴇʟᴏᴡ ɴᴜᴍʙᴇʀ 💗*

1️⃣ *ᴀᴜᴅɪᴏ (ᴍᴘ3)*
2️⃣ *ᴅᴏᴄᴜᴍᴇɴᴛ ᴛʏᴘᴇ*
3️⃣ *ᴠᴏɪᴄᴇ ɴᴏᴛᴇ*
 
𝐏𝐎𝐖𝐄𝐑𝐃 𝐁𝐘 𝐃𝐀𝐑𝐊 𝐀𝐒𝐇𝐄𝐍 𝐗𝐌𝐃 💀👾`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption
        }, { quoted: m });

        const messageID = sentMsg.key.id;

    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg?.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, { react: { text: '⏳', key: receivedMsg.key } });

        switch (receivedText.trim()) {
                case "1":
                    await conn.sendMessage(senderID, {
                        audio: { url: result.audio_url },
                        mimetype: "audio/mpeg",
                        ptt: false,
                    }, { quoted: receivedMsg });
                    break;

                case "2":
                    await conn.sendMessage(senderID, {
                        document: { url: result.audio_url },
                        mimetype: "audio/mpeg",
                        fileName: `${data.title}.mp3`
                    }, { quoted: receivedMsg });
                    break;

                case "3":
                    await conn.sendMessage(senderID, {
                        audio: { url: result.audio_url },
                        mimetype: "audio/mpeg",
                        ptt: true,
                    }, { quoted: receivedMsg });
                    break;

          default:
            reply("❌ Invalid option! Please reply with 1, 2, or 3.");
        }
      }
    });

  } catch (error) {
    console.error("Song Command Error:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});


cmd({
    pattern: "video3",
    react: "🎬",
    desc: "Download YouTube MP4",
    category: "download",
    use: ".video <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("❓ What video do you want to download?");

        const search = await yts(q);
        if (!search.videos.length) return reply("❌ No results found for your query.");

        const data = search.videos[0];
        const ytUrl = data.url;

        const api = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.media?.video_url) {
            return reply("❌ Unable to download the video. Please try another one!");
        }

        const result = apiRes.result.media;

        const caption = `
🎥 *ᴠɪᴅᴇᴏ ᴅᴏᴡɴʟᴏᴅᴇʀ.* 📥

📑 *ᴛɪᴛᴇʟ:* ${data.title}
⏱️ *ᴅᴜʀᴀᴛɪᴏɴ:* ${data.timestamp}
📆 *ᴜᴘʟᴏᴀᴅᴇᴅ:* ${data.ago}
📊 *ᴠɪᴇᴡꜱ:* ${data.views}
🔗 *ʟɪɴᴋ:* ${data.url}

🔢 *ʀᴇᴘʟʏ ʙᴇʟᴏᴡ ɴᴜᴍʙᴇʀ 💗*

1️⃣ *ᴀᴜᴅɪᴏ (ᴍᴘ3)*
2️⃣ *ᴅᴏᴄᴜᴍᴇɴᴛ ᴛʏᴘᴇ*
 
𝐏𝐎𝐖𝐄𝐑𝐃 𝐁𝐘 𝐃𝐀𝐑𝐊 𝐀𝐒𝐇𝐄𝐍 𝐗𝐌𝐃 💀👾`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: result.thumbnail },
            caption
        }, { quoted: m });

        const messageID = sentMsg.key.id;

    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg?.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, { react: { text: '⏳', key: receivedMsg.key } });

        switch (receivedText.trim()) {
                case "1":
                    await conn.sendMessage(senderID, {
                        video: { url: result.video_url },
                        mimetype: "video/mp4",
                        ptt: false,
                    }, { quoted: receivedMsg });
                    break;

                case "2":
                    await conn.sendMessage(senderID, {
                        document: { url: result.video_url },
                        mimetype: "video/mp4",
                        fileName: `${data.title}.mp4`
                    }, { quoted: receivedMsg });
                    break;

          default:
            reply("❌ Invalid option! Please reply with 1, or 2.");
        }
      }
    });

  } catch (error) {
    console.error("Video Command Error:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});
