import yts from 'yt-search';
import fetch from 'node-fetch'

function formats(views) {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (views >= 1000) {
        return (views / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return views.toString();
}

const handler = async (m, { conn, text, usedPrefix }) => {
  if (!text) throw 'Masukkan Judul / Link Dari YouTube!';
  try {
    let data = (await yts(text)).all
    let hasil = data[~~(Math.random() * data.length)]
    let gabut = await fetch(`https://api.betabotz.eu.org/api/download/yt?url=${hasil.url}&apikey=btzziaulhaq`)
    if (!hasil) throw 'Video/Audio Tidak Ditemukan';
    if (hasil.seconds >= 7200) {
      return conn.reply(m.chat, 'Video lebih dari 2 jam!', m);
    } else {
      let audioUrl;
      try {
        audioUrl = await gabut.json() 
      } catch (e) {
        conn.reply(m.chat, 'Tunggu sebentar...', m);
        audioUrl = await gabut.json();
      }

      let caption = '';
      caption += `∘ Judul : ${hasil.title}\n`;
      caption += `∘ Ext : Search\n`;
      caption += `∘ ID : ${hasil.videoId}\n`;
      caption += `∘ Durasi : ${hasil.timestamp}\n`;
      caption += `∘ Penonton : ${hasil.views}\n`;
      caption += `∘ Diunggah : ${hasil.ago}\n`;
      caption += `∘ Penulis : ${hasil.author.name}\n`;
      caption += `∘ Channel : ${hasil.author.url}\n`;
      caption += `∘ Url : ${hasil.url}\n`;
      caption += `∘ Deskripsi : ${hasil.description}\n`;
      caption += `∘ Thumbnail : ${hasil.image}`;

      await conn.relayMessage(m.chat, {
        extendedTextMessage: {
          text: caption,
          contextInfo: {
            externalAdReply: {
              title: hasil.title,
              mediaType: 1,
              previewType: 0,
              renderLargerThumbnail: true,
              thumbnailUrl: hasil.image,
              sourceUrl: audioUrl.result.mp3
            }
          },
          mentions: [m.sender]
        }
      }, {});

      await conn.sendMessage(m.chat, {
        audio: {
          url: audioUrl.result.mp3
        },
        mimetype: 'audio/mpeg',
        contextInfo: {
          externalAdReply: {
            title: hasil.title,
            body: "",
            thumbnailUrl: hasil.image,
            sourceUrl: audioUrl.result.mp3,
            mediaType: 1,
            showAdAttribution: true,
            renderLargerThumbnail: true
          }
        }
      }, {
        quoted: m
      });
    }
  } catch (e) {
    conn.reply(m.chat, `*Error:* ` + e.message, m);
  }
};

handler.command = handler.help = ['play', 'song'];
handler.tags = ['downloader'];
handler.exp = 0;
handler.limit = true;
handler.premium = false;

export default handler;
