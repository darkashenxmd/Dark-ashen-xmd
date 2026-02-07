const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    react: "✅", 
    desc: "Get owner number",
    category: "main",
    filename: __filename
}, 
async (conn, mek, m, { from }) => {
    try {
        const ownerNumber = config.OWNER_NUMBER; // Fetch owner number from config
        const ownerName = config.OWNER_NAME;     // Fetch owner name from config

        const vcard = 'BEGIN:VCARD\n' +
                      'VERSION:3.0\n' +
                      `FN:${ownerName}\n` +  
                      `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}\n` + 
                      'END:VCARD';

        // Send the vCard
        const sentVCard = await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

     // Fake VCard
        const FakeVCard = {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
      },
      message: {
        contactMessage: {
          displayName: "𝐃𝐀𝐑𝐊 𝐀𝐒𝐇𝐄𝐍 𝐗𝐌𝐃 💀👾",
          vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Meta\nORG:META AI;\nTEL;type=CELL;type=VOICE;waid=13135550002:+13135550002\nEND:VCARD`
        }
      }
    };
        
        // Send the owner contact message with image and audio
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/brlkte.jpg' }, // Image URL from your request
            caption: `
╭━〔 *━[ ᴅᴀʀᴋ ᴀꜱʜᴇᴍ xᴍᴅ ]-➢*
┃◈╭───────────┈⊷
┃◈┃• *Here is the owner details*
┃◈┃• *Name* - ${ownerName}
┃◈┃• *Number* ${ownerNumber}
┃◈┃• *Version*: 2.0.0 Beta
┃◈└───────────┈⊷
╰──────────────┈⊷
> 𝐏𝐎𝐖𝐄𝐑𝐃 𝐁𝐘 𝐃𝐀𝐑𝐊 𝐀𝐒𝐇𝐄𝐍 𝐗𝐌𝐃 💀👾`, // Display the owner's details
            
            contextInfo: {
                mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`], 
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363423214034064@newsletter',
                    newsletterName: 'ᴅᴀʀᴋ ᴀꜱʜᴇɴ xᴍᴅ',
                    serverMessageId: 143
                }            
            }
        }, { quoted: FakeVCard });

    } catch (error) {
        console.error(error);
        reply(`An error occurred: ${error.message}`);
    }
});
