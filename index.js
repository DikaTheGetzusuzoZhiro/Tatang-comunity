const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Role ID sing bisa Reset/Hapus
const ADMIN_ROLE_ID = '1479064744714567680';

// Database sementara (Bakal reset nek bot mati/restart nang Railway)
let claimedUsers = new Map(); 

// Fungsi Token Harian (Sinkron karo Lua)
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

    // Rumus token unik saben dina (Ora bakal padha karo wingi)
    const part1 = (y + m + d) * 153;
    const part2 = (y * d) + (m * 42);
    return `AF-${part1}-${part2}`;
}

client.once('ready', () => {
    console.log(`✅ ${client.user.tag} Online!`);
    
    // Auto Reset Database saben jam 00:00 WIB
    setInterval(() => {
        const saiki = new Date().toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' });
        if (saiki === "00:00") {
            claimedUsers.clear();
            console.log("⚠️ Database otomatis direset (Pergantian Hari).");
        }
    }, 60000);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Perintah Setup Panel
    if (message.content === '!setup') {
        const embed = new EmbedBuilder()
            .setColor('#39FF14') // Neon Green
            .setTitle('🎣 TATANG COMMUNITY - TOKEN SYSTEM')
            .setDescription('Klik tombol nang ngisor nggo njikot utawa ngecek token login.\n\n' +
                '**ATURAN:**\n' +
                '> 1️⃣ User mung bisa **Claim** sepisan sedina.\n' +
                '> 2️⃣ Nek wis claim, gunakna tombol **Cek Token**.\n' +
                '> 3️⃣ Token ganti otomatis saben jam 00:00 WIB.')
            .setFooter({ text: 'AutoFish v3.0 • Developer Tatang' });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder().setCustomId('claim').setLabel('🎁 Claim Token').setStyle(ButtonStyle.Success).setEmoji('🔑'),
                new ButtonBuilder().setCustomId('cek').setLabel('🔍 Cek Token').setStyle(ButtonStyle.Primary).setEmoji('👀')
            );

        await message.channel.send({ embeds: [embed], components: [row] });
    }

    // Perintah Admin: Reset Kabeh (!resetall)
    if (message.content === '!resetall') {
        if (!message.member.roles.cache.has(ADMIN_ROLE_ID)) return message.reply('❌ Ko udu admin, su!');
        claimedUsers.clear();
        message.reply('✅ Kabeh data claim wis di-reset!');
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const userId = interaction.user.id;
    const tokenToday = getDailyToken();

    // LOGIKA TOMBOL CLAIM
    if (interaction.customId === 'claim') {
        if (claimedUsers.has(userId)) {
            return interaction.reply({ content: '❌ Ko wis tau claim dina kiye! Klik tombol **Cek Token** bae.', ephemeral: true });
        }
        
        claimedUsers.set(userId, tokenToday);
        const embed = new EmbedBuilder()
            .setColor('#39FF14')
            .setTitle('🔑 TOKEN BERHASIL DICLAIM')
            .setDescription(`Token-mu dina kiye:\n\`\`\`${tokenToday}\`\`\``)
            .setFooter({ text: 'Simpen token kiye, aja nganti ilang!' });
            
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // LOGIKA TOMBOL CEK
    if (interaction.customId === 'cek') {
        if (!claimedUsers.has(userId)) {
            return interaction.reply({ content: '❌ Ko urung claim token! Klik tombol **Claim Token** dhisit.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#00BFFF')
            .setTitle('🔍 TOKEN LOGIN-MU')
            .setDescription(`Token-mu sing aktif:\n\`\`\`${tokenToday}\`\`\``);
            
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);
