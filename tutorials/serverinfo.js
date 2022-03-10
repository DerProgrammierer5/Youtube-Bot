const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);

bot.on("messageCreate", async message=>{
    if(message.content === "!serverinfo"){
        if(!message.guild) return;

        let embed = new Discord.MessageEmbed()
        .setTitle("**ServerInfo**")
        .setColor("RANDOM")
        .setThumbnail(message.guild.iconURL())
        .addField("**Name**: ",message.guild.name, true)
        .addField("**Id**: ",message.guild.id, true)
        .addField("**Owner**: ","<@!"+message.guild.ownerId+">", true)
        .addField("**Verifiziert**: ",message.guild.verified, true)
        .addField("**Mitglieder**: ",message.guild.memberCount, true)
        .addField("**Erstellt am**: ",message.guild.createdAt, true)

        message.channel.send({embeds:[embed]});
    }
})