const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
const serverstats = require("pfad zur datei");
bot.login(token);

bot.on("messageCreate", async message=>{
    if(message.content.startsWith(prefix+"setup")){
        if(!serverstats[message.guild.id].welcomechannel){
            serverstats[message.guild.id].welcomechannel = "nochannel"
        }

        let newchannel = message.mentions.channels.first();

        if(!newchannel) return message.reply({content:"Du hast keinen Kanal angegeben!"}).then(msg=>msg.delete({timeout:"5000"}));
    
        serverstats[message.guild.id].welcomechannel = newchannel.name;

        message.channel.send({content:"Der welcome channel ist nun "+newchannel.name})

        fs.writeFile("pfad zur datei", JSON.stringify(serverstats), function(err){
            if(err) console.log(err);
        })
    }
})

bot.on("guildMemberAdd", function(member){
    let channel = member.guild.channels.cache.find(ch => ch.name === serverstats[member.guild.id].welcomechannel);
    if(!channel || channel.name === "nochannel") return;
    channel.send({content:member.displayName + " ist dem Server beigetreten!"});

    let role = member.guild.roles.cache.find(rl=>rl.name === "test");
    if(!role) return;
    member.roles.add(role);
})