const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);

bot.on("messageCreate", async message=>{
    if(message.content.startsWith("!timeout")){
        let member = message.mentions.members.first();
        let zeit = Number(message.content.split(" ").slice(2,3).join(" ")) || 60;
        let grund = message.content.split(" ").slice(3).join(" ") || "Kein grund angegeben";
        if(!member) return message.channel.send({content:"Du musst einen member angeben!"});
        let errr = 0;
        member.timeout(zeit * 1000, grund).catch(err=>{
            errr = 1;
            return message.channel.send({content:"Konnte den member nicht timeouten: "+err})
        }).then(()=>{
            if(errr == 0) message.channel.send({content:`${member} erfolgreich für ${zeit} sekunden getimeoutet.`})
        })
    }
})