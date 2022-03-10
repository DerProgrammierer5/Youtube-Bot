const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);

bot.on("messageCreate", async message=>{
    if(message.content.startsWith("!kick")){
        message.delete()
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply({content:"Du hast keine Rechte dafür!"}).then(msg=>msg.delete({timeout:"5000"}));

        let user = message.mentions.members.first();

        if(!user) return message.reply({content:"Du hast vergessen einen Nutzer anzugeben!"}).then(msg=>msg.delete({timeout:"5000"}));

        message.guild.member(user).kick().catch(err=>{
            if(err){
                message.channel.send({content:"Konnte den Nutzer nicht kicken: "+err}).then(msg=>msg.delete({timeout:"10000"}));
            }else{
                message.channel.send({content:"Erfolgreich den Nutzer gekickt!"}).then(msg=>msg.delete({timeout:"5000"}));
            }
        })
    }
})