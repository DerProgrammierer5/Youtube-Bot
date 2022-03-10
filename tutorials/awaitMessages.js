const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);

bot.on("messageCreate", async message=>{
    if(message.content === "!widerhole"){
        message.reply({content:"Sage was ich sagen soll, du hast 30 Sekunden!"});

        const filter = m => m.author.id === message.author.id;

        message.channel.awaitMessages(filter, {max:1,time:5*1000}).then(collections=>{
            let gesmessage = collections.first().content;

            if(gesmessage === "cancel") return message.channel.send({content:"Erfolgreich abgebrochen!"}).then(msg=>msg.delete({timeout:"5000"}));

            message.channel.send({content:"Du sagtest: "+gesmessage});
        }).catch(err=>{
            if(err) return message.reply({content:"Die zeit ist abgelaufen!"}).then(msg=>msg.delete({timeout:"5000"}));
        })
    }
})