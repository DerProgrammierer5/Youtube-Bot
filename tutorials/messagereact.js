const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);

bot.on("messageCreate", async message=>{
    if(message.content.startsWith("!react")){

        let text = message.content.split(" ").slice(1).join(" ");

        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply({content:"Du hast keine Rechte dafür!"});

        message.channel.send({content:text}).then(msg=>{
            msg.react('👍');
        })
    }
})