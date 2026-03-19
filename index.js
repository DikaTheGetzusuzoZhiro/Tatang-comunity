const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Fungsi token harian (Wajib sama dengan Lua)
function getDailyToken() {
    const options = { timeZone: 'Asia/Jakarta', year: 'numeric', month: 'numeric', day: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(new Date());
    
    let y, m, d;
    parts.forEach(p => {
        if (p.type === 'year') y = parseInt(p.value);
        if (p.type === 'month') m = parseInt(p.value);
        if (p.type === 'day') d = parseInt(p.value);
    });

    const part1 = (y + m + d) * 153;
    const part2 = (y * d) + (m * 42);
    return `AF-${part1}-${part2}`;
}

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} Is Online!`);
});

client.on('messageCreate', async (message) => {
    if (message.content === '!setup') {
        const embed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('🎣 TATANG COMMUNITY - AUTOFISH')
            .setDescription('Klik tombol nang ngisor kiye nggo njikot token login dina kiye.\n\n**INFO:**\n> 🕒 Token ganti saben jam 00:00 WIB.\n> 🔑 Token mung bisa dinggo 24 jam.')
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({ text: 'AutoFish System • Developer Tatang', iconURL: client.user.displayAvatarURL() });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('claim_token')
                    .setLabel('Claim Token')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('🔑')
            );

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'claim_token') {
        const tokenToday = getDailyToken();
        const response = new EmbedBuilder()
            .setColor('#f1c40f')
            .setTitle('✨ TOKEN KAMU HARI INI')
            .setDescription(`Monggo dicopy token-ne:\n\n\`\`\`${tokenToday}\`\`\`\n*Paste-na nang menu login script AutoFish.*`)
            .setTimestamp();

        await interaction.reply({ embeds: [response], ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);
