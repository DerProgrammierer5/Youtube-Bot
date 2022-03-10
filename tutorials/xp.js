const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);

bot.on("messageCreate", async message=>{
    if(message.author.bot) return;
    var addXP = Math.floor(Math.random() * 8) + 3;

    if(!xpfile[message.author.id]){
        xpfile[message.author.id] = {
            xp: 0,
            level: 1,
            reqxp: 100
        }

        fs.writeFile("./xp.json",JSON.stringify(xpfile),function(err){
            if(err) console.log(err)
        })
    }

    xpfile[message.author.id].xp += addXP
    
    if(xpfile[message.author.id].xp > xpfile[message.author.id].reqxp){
        xpfile[message.author.id].xp -= xpfile[message.author.id].reqxp // xp abziehen
        xpfile[message.author.id].reqxp *= 1.25 //xp die man braucht erhöhen
        xpfile[message.author.id].reqxp = Math.floor(xpfile[message.author.id].reqxp) //reqxp runden
        xpfile[message.author.id].level += 1 //1 level hinzufügen

        message.reply({content:"ist nun Level **"+xpfile[message.author.id].level+"**!"}).then(
            msg=>msg.delete({timeout:"10000"})
        )
    }

    fs.writeFile("./xp.json",JSON.stringify(xpfile),function(err){
        if(err) console.log(err)
    })

    if(message.content.startsWith("!level")){
        let user = message.mentions.users.first() || message.author

        if(user.bot) return message.reply({content:"Bots haben kein XP!"})

        let embed = new Discord.MessageEmbed()
        .setTitle("Level Karte")
        .setColor("GREEN")
        .addField("Level: ",xpfile[user.id].level)
        .addField("XP: ", xpfile[user.id].xp+"/"+xpfile[user.id].reqxp)
        .addField("Xp bis zum nächsten Level: ",xpfile[user.id].reqxp)
        message.channel.send({embeds:[embed]})
    }
})