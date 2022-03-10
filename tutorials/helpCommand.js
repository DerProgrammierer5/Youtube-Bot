const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);

bot.on("messageCreate",async message=>{
    if(message.content === `!help`){
        let embed = new Discord.MessageEmbed()
        .setTitle("**Die Hilfe**")
        .addField("Hilfe:", "Es gibt keine Hilfe.", true)
        .addField("Hilfe1:", "Es gibt keine Hilfe.2", true)
        .addField("Hilfe2:", "Es gibt keine Hilfe.3", true)
        .addField("Hilfe3:", "Es gibt keine Hilfe.4", true)
        .addField("Hilfe4:", "Es gibt keine Hilfe.5", true)
        .setColor("RANDOM")
        .setFooter({text:":D"})
        .setThumbnail("https://i.ibb.co/x1gM4RG/roulette-rad.gif")

        message.channel.send({embeds:[embed]});
    }
})