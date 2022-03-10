const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);

bot.on("messageCreate", async message=>{
    if(message.content.startsWith("!user")){
        let user = message.mentions.users.first() || message.author

        let embed = new Discord.MessageEmbed()
        .setThumbnail(user.avatarURL())
        .setColor("RANDOM")
        .addField("Username:", user.username, true)
        .addField("Discriminator:", u`#${user.discriminator}`, true)
        .addField("ID:", user.id.toString(), true)
        .addField("BOT:", user.bot.toString(), true)
        .addField("Created at:", user.createdAt, true)

        message.channel.send({embeds:[embed]});
    }
})