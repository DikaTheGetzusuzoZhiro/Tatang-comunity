const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Fungsi pembuat token harian (SINKRON DENGAN LUA)
function getDailyToken() {
    // Menggunakan timezone WIB (Asia/Jakarta)
    const options = { timeZone: 'Asia/Jakarta', year: 'numeric', month: 'numeric', day: 'numeric' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(new Date());
    
    let y, m, d;
    parts.forEach(p => {
        if (p.type === 'year') y = parseInt(p.value);
        if (p.type === 'month') m = parseInt(p.value);
        if (p.type === 'day') d = parseInt(p.value);
    });

    // Rumus rahasia (harus persis dengan script Lua)
    const part1 = (y + m + d) * 153;
    const part2 = (y * d) + (m * 42);

    return `AF-${part1}-${part2}`;
}

client.once('ready', () => {
    console.log(`✅ Bot Discord AutoFish sudah online sebagai ${client.user.tag}!`);
});

// Perintah untuk memunculkan tombol Claim
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '!setuptoken') {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎣 AutoFish Daily Token')
            .setDescription('Token ini digunakan untuk masuk ke menu AutoFish di dalam game.\n\n⚠️ **Penting:**\n> Token akan berubah setiap hari pada jam 00:00 WIB.\n> Klik tombol di bawah untuk mendapatkan token rahasia hari ini.')
            .setFooter({ text: 'Developer Tatang - AutoFish System' })
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
        message.delete().catch(() => {}); // Hapus pesan '!setuptoken'
    }
});

// Respon saat tombol diclaim
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'claim_token') {
        const tokenToday = getDailyToken();

        const replyEmbed = new EmbedBuilder()
            .setColor('#2ecc71')
            .setTitle('✅ Token Berhasil Diklaim!')
            .setDescription(`Halo <@${interaction.user.id}>, ini token kamu untuk hari ini:\n\n\`\`\`${tokenToday}\`\`\`\n*Silakan copy dan paste ke dalam menu AutoFish di dalam game.*`)
            .setFooter({ text: 'Token ini kadaluarsa pukul 23:59 WIB nanti.' });

        // ephemeral: true berarti HANYA user yang klik yang bisa lihat pesannya
        await interaction.reply({ embeds: [replyEmbed], ephemeral: true });
    }
});

// MASUKKAN TOKEN DISCORD BOT ANDA DI SINI
client.login('TOKEN_BOT_DISCORD_ANDA_DISINI');
