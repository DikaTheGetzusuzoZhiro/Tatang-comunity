const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Fungsi Token Harian (Sinkron karo Lua)
function getDailyToken() {
    // Lock nang Zona Waktu WIB (Asia/Jakarta) ben ora melu jam server luar negeri
    const options = { timeZone: 'Asia/Jakarta', year: 'numeric', month: 'numeric', day: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(new Date());
    
    let y, m, d;
    parts.forEach(p => {
        if (p.type === 'year') y = parseInt(p.value);
        if (p.type === 'month') m = parseInt(p.value);
        if (p.type === 'day') d = parseInt(p.value);
    });

    // Rumus Rahasia (Wajib padha karo Script Lua)
    const part1 = (y + m + d) * 153;
    const part2 = (y * d) + (m * 42);

    return `AF-${part1}-${part2}`;
}

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} Online & Ready!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Perintah nggo ngetokna tombol claim
    if (message.content === '!setup') {
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🎣 TATANG COMMUNITY - AUTOFISH')
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(
                'Sugeng rawuh! Klik tombol nang ngisor kiye nggo njikot token login dina kiye.\n\n' +
                '**SYARAT & KETENTUAN:**\n' +
                '> 🔑 **Token** bakal ganti otomatis saben jam 00:00 WIB.\n' +
                '> 🕒 **Durasi:** Token mung berlaku 24 jam.\n' +
                '> 📺 **Tutorial:** Cek YouTube `@tatanglua`'
            )
            .setFooter({ text: 'AutoFish System v2.0 • Developer Tatang' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('claim_token')
                    .setLabel('🎁 Claim Token Hari Ini')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji('🔑')
            );

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'claim_token') {
        const tokenToday = getDailyToken();

        const successEmbed = new EmbedBuilder()
            .setColor('#F1C40F')
            .setTitle('✨ TOKEN BERHASIL DI-CLAIM!')
            .setDescription(
                `Halo **${interaction.user.username}**, kiye token login-mu:\n\n` +
                `\`\`\`${tokenToday}\`\`\`\n` +
                '*Copy token nang ndhuwur terus paste nang script game-mu.*'
            )
            .setFooter({ text: 'Aja lali mampir YouTube Tatang Lua!' });

        await interaction.reply({ embeds: [successEmbed], ephemeral: true });
    }
});

// Railway Variables (Aja diganti manual!)
client.login(process.env.DISCORD_TOKEN);
