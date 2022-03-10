const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
const serverstats = require("pfad zur datei")
bot.login(token);

bot.on("messageCreate", async message=>{

    if(!serverstats[message.guild.id]){
        serverstats[message.guild.id] = {
            globalchat:"noID",
        }
    }

    fs.writeFile("pfadzurdatei", JSON.stringify(serverstats), err =>{
        if(err){
            console.log(err);
        }
    })

    if(message.content.startsWith(prefix+"globalsetup")){
        let channel = message.mentions.channels.first();
        if(!channel) return message.channel.send({content:"Du hast keinen Kanal aneggeben."}).then(msg=>msg.delete({timeout:"5000"}));
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send({content:"Du hast keien Rechte dafür."}).then(msg=>msg.delete({timeout:"5000"}));
        if(!serverstats[message.guild.id].globalchat){
            serverstats[message.guild.id].globalchat = "noID"
        }
        serverstats[message.guild.id].globalchat = channel.id;
        message.channel.send({content:"Der Globalchat ist nun <#"+channel.id+">."}).then(msg=>msg.delete({timeout:"8000"}));
    }

    //unsetup

    if(message.content.startsWith(prefix+"globalunsetup")){
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send({content:"Du hast keien Rechte dafür."}).then(msg=>msg.delete({timeout:"5000"}));
        if(!serverstats[message.guild.id].globalchat){
            serverstats[message.guild.id].globalchat = "noID"
        }
        serverstats[message.guild.id].globalchat = "noID";
        message.channel.send({content:"Der Globalchat wurde geunsetupped."}).then(msg=>msg.delete({timeout:"8000"}));
    }

    //globalchat

    if(message.channel.id === serverstats[message.guild.id].globalchat && !message.content.startsWith(prefix) && !message.author.bot){
        bot.guilds.cache.forEach(guild=>{
            if(guild.id !== message.guild.id){
                if(serverstats[guild.id]){
                    if(serverstats[guild.id].globalchat != "NoID"){
                        if(guild.channels.cache.get(serverstats[guild.id].globalchat)){
                            let embed = new Discord.MessageEmbed()
                            .setAuthor(message.author.tag)
                            .setTitle("GLOBALCHAT")
                            .setColor("RANDOM")
                            .setDescription(message.content)
                            .setFooter("Guild: "+message.guild.name, message.guild.iconURL())
                            .setThumbnail(message.author.displayAvatarURL({dynamic:true}))
                            .setTimestamp()
                            guild.channels.cache.get(serverstats[guild.id].globalchat).send({embeds:[embed]});
                        }
                    }
                }
            }
        })
    }

    fs.writeFile("pfad zur datei", JSON.stringify(serverstats), err =>{
        if(err){
            console.log(err);
        }
    })
})