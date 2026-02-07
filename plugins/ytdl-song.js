const {cmd , commands} = require('../command')
const fetch = require('node-fetch');
const yts = require('yt-search');
const axios = require('axios');


cmd({
    pattern: "song4",
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

        const api = `https://api-aswin-sparky.koyeb.app/api/downloader/song?search=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.data?.url) {
            return reply("❌ Unable to download the song. Please try another one!");
        }

        const result = apiRes.data;

        const caption = `
🎵 *ꜱᴏɴɢ ᴅᴏᴡɴʟᴏᴅᴇʀ.* 📥

📑 *Title:* ${data.title}
⏱️ *Duration:* ${data.timestamp}
📆 *Uploaded:* ${data.ago}
📊 *Views:* ${data.views}
🔗 *Link:* ${data.url}

🔢 *ʀᴇᴘʟʏ ʙᴇʟᴏᴡ ɴᴜᴍʙᴇʀ 💗*

1️⃣ *ᴀᴜᴅɪᴏ (ᴍᴘ3)*
2️⃣ *ᴅᴏᴜᴍᴇɴᴛ ᴛʏᴘᴇ*
3️⃣ *ᴠᴏɪᴄᴇ ɴᴏᴛᴇ*
 
𝐏𝐎𝐖𝐄𝐑𝐃 𝐁𝐘 𝐃𝐀𝐑𝐊 𝐀𝐒𝐇𝐄𝐍 𝐗𝐌𝐃 💀👾`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: data.thumbnail },
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
                        audio: { url: result.url },
                        mimetype: "audio/mpeg",
                        ptt: false,
                    }, { quoted: receivedMsg });
                    break;

                case "2":
                    await conn.sendMessage(senderID, {
                        document: { url: result.url },
                        mimetype: "audio/mpeg",
                        fileName: `${data.title}.mp3`
                    }, { quoted: receivedMsg });
                    break;

                case "3":
                    await conn.sendMessage(senderID, {
                        audio: { url: result.url },
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
  pattern: "play",
  react: "🎵",
  desc: "Download YouTube song (Audio) via Nekolabs API",
  category: "download",
  use: ".play <query>",
  filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply("⚠️ Please provide a song name or YouTube link.");

    // 🔹 API Call
    const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(q)}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    // 🔹 Validate response
    if (!data?.success || !data?.result?.downloadUrl) {
      return reply("❌ Song not found or API error. Try again later.");
    }

    const meta = data.result.metadata;
    const dlUrl = data.result.downloadUrl;

    // 🔹 Try to fetch thumbnail
    let buffer = null;
    try {
      const thumbRes = await fetch(meta.cover);
      buffer = Buffer.from(await thumbRes.arrayBuffer());
    } catch {}

    // 🔹 Caption design
    const caption = `
🎵 *Song Downloader.* 📥

📑 *ᴛɪᴛʟᴇ :* ${meta.title}
⏱ *ᴅᴜʀᴀᴛɪᴏɴ :* ${meta.duration}
⏰ *ʀᴇꜱᴘᴏɴꜱᴇᴛɪᴍᴇ :* ${data.responseTime}
📡 *ᴄʜᴀɴɴᴇʟ :* ${meta.channel}
🔗 *ʟɪɴᴋ :* ${meta.url}

🔢 *ʀᴇᴘʟʏ ʙᴇʟᴏᴡ ɴᴜᴍʙᴇʀ 💗*

1️⃣ *ᴀᴜᴅɪᴏ ᴛʏᴘᴇ*
2️⃣ *ᴅᴏᴄᴜᴍᴇɴᴛ ᴛʏᴘᴇ*
3️⃣ *ᴠᴏᴄɪᴇ ɴᴏᴛᴇ*

𝐏𝐎𝐖𝐄𝐑𝐃 𝐁𝐘 𝐃𝐀𝐑𝐊 𝐀𝐒𝐇𝐄𝐍 𝐗𝐌𝐃 💀👾`;

        const sentMsg = await conn.sendMessage(from, {
            image: buffer || { url: meta.cover },
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
                            audio: { url: dlUrl },
                            mimetype: "audio/mpeg",
                            ptt: false,
                        }, { quoted: receivedMsg });
                        break;

                    case "2":
                        await conn.sendMessage(senderID, {
                            document: { url: dlUrl },
                            mimetype: "audio/mpeg",
                            fileName: `${meta.title}.mp3`
                        }, { quoted: receivedMsg });
                        break;

                    case "3":
                        await conn.sendMessage(senderID, {
                            audio: { url: dlUrl },
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
