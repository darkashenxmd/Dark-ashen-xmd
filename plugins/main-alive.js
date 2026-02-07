const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    desc: "Check bot is alive or not",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const status = `
╭──┝ ━[ ᴀʟɪᴠᴇ ꜱᴛᴀᴛᴜꜱ.]-➢──◉
│
│ ✨ _Bot is Active & Online!_
│
│ 🧠 *ᴏᴡɴᴇʀ:* ${config.OWNER_NAME}
│ ⚡ *ᴠᴇʀꜱɪᴏɴ:* 2.0.0
│ 📝 *ᴘʀᴇᴅɪx:* [${config.PREFIX}]
│ 📳 *ᴍᴏᴅᴇ:* [${config.MODE}]
│ 💾 *ʀᴀᴍ:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
│ 🖥️ *ʜᴏꜱᴛ:* ${os.hostname()}
│ ⌛ *ᴜᴘᴛɪᴍᴇ:* ${runtime(process.uptime())}
╰───────────────◉
> ${config.DESCRIPTION}`;

       // Fake VCard
        const FakeVCard = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
      },
      message: {
        contactMessage: {
          displayName: "ᴅᴀʀᴋ ᴀꜱʜᴇɴ xᴍᴅ",
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Meta\nORG:META AI;\nTEL;type=CELL;type=VOICE;waid=13135550002:+13135550002\nEND:VCARD`
        }
      }
    };      
        
        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL },
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363423214034064@newsletter',
                    newsletterName: 'ᴅᴀʀᴋ ᴀꜱʜᴇɴ xᴍᴅ',
                    serverMessageId: 143
                }
            }
        }, { quoted: FakeVCard });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
