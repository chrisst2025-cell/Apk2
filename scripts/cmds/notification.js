const { getStreamsFromAttachment } = global.utils;

const botName = "𝗠𝗶𝗻𝗮𝘁𝗼";

module.exports = {
	config: {
		name: "notification",
		aliases: ["notify", "noti"],
		version: "1.7",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		description: {
			vi: "Gửi thông báo từ admin đến all box",
			en: "Envoyer une notification à tous les groupes"
		},
		category: "owner",
		guide: {
			en: "{pn} <message>"
		},
		envConfig: {
			delayPerGroup: 250
		}
	},

	langs: {
		en: {
			missingMessage:
` ❲ MINATO NAMIKAZE  ❳ 
━━━━━━━━━━━━━━━
💬 ᴠᴇᴜɪʟʟᴇᴢ ᴇɴᴛʀᴇʀ ʟᴇ ᴍᴇssᴀɢᴇ ǫᴜᴇ ᴠᴏᴜs ᴠᴏᴜʟᴇᴢ ǫᴜᴇ ᴊ'ᴇɴᴠᴏɪᴇ ᴀ̀ ᴛᴏᴜs ʟᴇs ɢʀᴏᴜᴘᴇs.

⚡ ᴊ'ᴀᴛᴛᴇɴᴅs ᴠᴏs ᴏʀᴅʀᴇs, ᴇ́ᴄʀɪᴠᴇᴢ ᴠᴏᴛʀᴇ ɴᴏᴛɪғɪᴄᴀᴛɪᴏɴ.

✍️ ᴇxᴇᴍᴘʟᴇ : ɴᴏᴛɪғɪᴄᴀᴛɪᴏɴ ʙᴏɴᴊᴏᴜʀ
━━━━━━━ ✕ ━━━━━━`,

			notification:
` ❲ MINATO NAMIKAZE  ❳ 
━━━━━━━━━━━━━━━
📡 ᴍᴇssᴀɢᴇ ᴏғғɪᴄɪᴇʟ ᴇɴᴠᴏʏᴇ́ ᴘᴀʀ ᴍᴏɴ ᴀᴅᴍɪɴ.

⚠️ ᴍᴇʀᴄɪ ᴅᴇ ɴᴇ ᴘᴀs ʀᴇ́ᴘᴏɴᴅʀᴇ ᴀ̀ ᴄᴇ ᴍᴇssᴀɢᴇ.
━━━━━━━ ✕ ━━━━━━`,

			sendingNotification:
` ❲ MINATO NAMIKAZE  ❳ 
━━━━━━━━━━━━━━━
⚡ ᴊᴇ ᴅᴇ́ᴘʟᴏɪᴇ ᴍᴀ ᴛᴇᴄʜɴɪǫᴜᴇ ᴇᴛ ᴄᴏᴍᴍᴇɴᴄᴇ ʟ'ᴇɴᴠᴏɪ ᴅᴇ ʟᴀ ɴᴏᴛɪғɪᴄᴀᴛɪᴏɴ ᴠᴇʀs %1 ɢʀᴏᴜᴘᴇ(s).
━━━━━━━ ✕ ━━━━━━`,

			sentNotification:
` ❲ MINATO NAMIKAZE  ❳ 
━━━━━━━━━━━━━━━
⚡ ᴊ'ᴀɪ ᴛʀᴀɴsᴍɪs ʟᴀ ɴᴏᴛɪғɪᴄᴀᴛɪᴏɴ ᴀᴠᴇᴄ sᴜᴄᴄᴇ̀s ᴀ̀ %1 ɢʀᴏᴜᴘᴇ(s).
━━━━━━━ ✕ ━━━━━━`,

			errorSendingNotification:
` ❲ MINATO NAMIKAZE  ❳ 
━━━━━━━━━━━━━━━
⚠️ ᴊᴇ ɴ'ᴀɪ ᴘᴀs ᴘᴜ ᴇɴᴠᴏʏᴇʀ ʟᴇ ᴍᴇssᴀɢᴇ ᴀ̀ %1 ɢʀᴏᴜᴘᴇ(s).

📌 ᴠᴇ́ʀɪғɪᴇᴢ ʟᴇs ᴇʀʀᴇᴜʀs ᴄɪ-ᴅᴇssᴏᴜs.
━━━━━━━ ✕ ━━━━━━

%2`
		}
	},

	onStart: async function ({
		message,
		api,
		event,
		args,
		commandName,
		envCommands,
		threadsData,
		getLang
	}) {

		const { delayPerGroup } = envCommands[commandName];

		if (!args[0])
			return message.reply(getLang("missingMessage"));

		const formSend = {
			body:
`${getLang("notification")}
━━━━━━━━━━━━━━━
💬 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗱𝗲 ${botName} :
${args.join(" ")}`,
			attachment: await getStreamsFromAttachment(
				[
					...event.attachments,
					...(event.messageReply?.attachments || [])
				].filter(item =>
					["photo", "png", "animated_image", "video", "audio"]
						.includes(item.type)
				)
			)
		};

		const allThreadID = (await threadsData.getAll())
			.filter(
				t =>
					t.isGroup &&
					t.members.find(
						m => m.userID == api.getCurrentUserID()
					)?.inGroup
			);

		message.reply(
			getLang("sendingNotification", allThreadID.length)
		);

		let sendSucces = 0;

		const sendError = [];

		const wattingSend = [];

		for (const thread of allThreadID) {

			const tid = thread.threadID;

			try {

				wattingSend.push({
					threadID: tid,
					pending: api.sendMessage(formSend, tid)
				});

				await new Promise(resolve =>
					setTimeout(resolve, delayPerGroup)
				);

			}
			catch (e) {
				sendError.push(tid);
			}
		}

		for (const sended of wattingSend) {

			try {

				await sended.pending;

				sendSucces++;

			}
			catch (e) {

				const { errorDescription } = e;

				if (
					!sendError.some(
						item =>
							item.errorDescription == errorDescription
					)
				)

					sendError.push({
						threadIDs: [sended.threadID],
						errorDescription
					});

				else

					sendError.find(
						item =>
							item.errorDescription == errorDescription
					).threadIDs.push(sended.threadID);
			}
		}

		let msg = "";

		if (sendSucces > 0)

			msg += getLang(
				"sentNotification",
				sendSucces
			) + "\n";

		if (sendError.length > 0)

			msg += getLang(
				"errorSendingNotification",
				sendError.reduce(
					(a, b) => a + b.threadIDs.length,
					0
				),
				sendError.reduce(
					(a, b) =>
						a +
						`\n - ${b.errorDescription}\n  + ${b.threadIDs.join("\n  + ")}`,
					""
				)
			);

		message.reply(msg);
	}
};
					
