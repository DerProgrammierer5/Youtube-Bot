const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);
bot.on("messageCreate", async message=>{
    if(message.content.startsWith("!clear")){
        let messages = message.content.split(" ").slice(1).join("");
    
        if(isNaN(messages)) return message.reply({content:"Du hast keine Zahl angegeben, sonder Buchstaben."}).then(msg=>msg.delete({timeout:"5000"}));
        
        message.channel.bulkDelete(messages);
    
        message.channel.send({content:"Habe " + messages + " Nachrichten gelöscht."}).then(msg=>msg.delete({timeout:"5000"}));
    }
})
