const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// KONFIGURASI
const ID_ROLE_ADMIN = '1479064744714567680';
let databaseClaim = new Map(); // Data user sing wis claim

// FUNGSI BUAT TOKEN (DIKUNCI KE WIB)
function generateTokenHarian() {
    const options = { timeZone: 'Asia/Jakarta', day: '2-digit', month: '2-digit', year: '2-digit' };
    const formatter = new Intl.DateTimeFormat('id-ID', options);
    const parts = formatter.formatToParts(new Date());
    
    let d, m, y;
    parts.forEach(p => {
        if (p.type === 'day') d = p.value;
        if (p.type === 'month') m = p.value;
        if (p.type === 'year') y = p.value;
    });

    // Rumus Token: AF + TanggalBulanTahun + Angka Unik
    const part1 = `${d}${m}${y}`; // Contoh: 190326
    const part2 = (parseInt(d) * parseInt(m)) + parseInt(y); // Contoh: (19*3)+26 = 83
    
    return `AF-${part1}-${part2}`;
}

client.once('ready', () => {
    console.log(`✅ Bot Berhasil Online sebagai: ${client.user.tag}`);
    
    // Cek saben menit nggo reset database pas jam 00:00 WIB
    setInterval(() => {
        const jamSekarang = new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour12: false });
        if (jamSekarang.startsWith("00:00")) {
            databaseClaim.clear();
            console.log("⚠️ Database claim otomatis direset (Sudah ganti hari).");
        }
    }, 60000);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // PERINTAH SETUP PANEL
    if (message.content === '!setup') {
        const embedPanel = new EmbedBuilder()
            .setColor('#39FF14') // Neon Green
            .setTitle('🎣 TATANG COMMUNITY - SISTEM TOKEN')
            .setDescription('Silakan klik tombol di bawah untuk mendapatkan token login hari ini.\n\n' +
                '**INFORMASI:**\n' +
                '> 🔑 **Claim:** Cuma bisa sekali sehari.\n' +
                '> 🔍 **Cek:** Gunakan jika kamu lupa tokenmu.\n' +
                '> 🕒 **Reset:** Token berganti setiap jam 00:00 WIB.')
            .setFooter({ text: 'AutoFish System • Developer Tatang' });

        const tombol = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('tombol_claim').setLabel('🎁 Claim Token').setStyle(ButtonStyle.Success).setEmoji('🔑'),
                new ButtonBuilder().setCustomId('tombol_cek').setLabel('🔍 Cek Token').setStyle(ButtonStyle.Primary).setEmoji('👀')
            );

        await message.channel.send({ embeds: [embedPanel], components: [tombol] });
    }

    // PERINTAH KHUSUS ADMIN ROLE (ID: 1479064744714567680)
    if (message.content === '!resetsemua') {
        if (!message.member.roles.cache.has(ID_ROLE_ADMIN)) return message.reply('❌ Kamu bukan Admin, Su!');
        databaseClaim.clear();
        message.reply('✅ Seluruh database claim user telah di-reset secara paksa!');
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const idUser = interaction.user.id;
    const tokenHariIni = generateTokenHarian();

    // LOGIKA TOMBOL CLAIM
    if (interaction.customId === 'tombol_claim') {
        if (databaseClaim.has(idUser)) {
            return interaction.reply({ content: '❌ Kamu sudah claim hari ini! Gunakan tombol **Cek Token** saja.', ephemeral: true });
        }
        
        databaseClaim.set(idUser, tokenHariIni);
        const embedClaim = new EmbedBuilder()
            .setColor('#39FF14')
            .setTitle('🔑 TOKEN BERHASIL DI-CLAIM')
            .setDescription(`Ini adalah token login kamu untuk hari ini:\n\n\`\`\`${tokenHariIni}\`\`\`\n*Token ini akan hangus besok jam 00:00 WIB.*`)
            .setFooter({ text: 'Pastikan simpan token ini baik-baik!' });

        await interaction.reply({ embeds: [embedClaim], ephemeral: true });
    }

    // LOGIKA TOMBOL CEK
    if (interaction.customId === 'tombol_cek') {
        if (!databaseClaim.has(idUser)) {
            return interaction.reply({ content: '❌ Kamu belum claim token hari ini! Silakan klik **Claim Token** dulu.', ephemeral: true });
        }

        const embedCek = new EmbedBuilder()
            .setColor('#00BFFF')
            .setTitle('🔍 CEK TOKEN KAMU')
            .setDescription(`Token aktif kamu saat ini:\n\n\`\`\`${tokenHariIni}\`\`\``);

        await interaction.reply({ embeds: [embedCek], ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);
