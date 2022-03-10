const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
const warnFile = require("pfad zur datei");
bot.login(token);

bot.on("messageCreate", async message=>{

    if(!warnFile[message.author.id+message.guild.id]){
        warnFile[message.author.id+message.guild.id] = {
            warns:0,
            maxwarn:3
        }
    }

    fs.writeFile("./warns.json", JSON.stringify(warnFile), function(err){
        if(err) console.log(err)
    })
    
    if(message.content.startsWith(prefix+"warn")){
        let user = message.mentions.users.first();
        let grund = message.content.split(" ").slice(2).join(" ");

        if(!user) return message.channel.send({content:"Du hast vergessen einen User zu erwähnen."}).then(msg=>msg.delete({timeout:"5000"}))
    
        if(!grund) grund = "Kein Grund"

        let embed = new Discord.MessageEmbed()
        .setTitle("Warnung!")
        .setDescription(`Warnung <@!${user.id}>, du wurdest verwarnt!\nGrund: ${grund}`)
        .setColor("RED")

        message.channel.send({embeds:[embed]}).then(msg=>msg.delete({timeout:"8000"}));

        if(!warnFile[user.id+message.guild.id]){
            warnFile[user.id+message.guild.id] = {
                warns:0,
                maxwarn:3
            }
        }
    
        warnFile[user.id+message.guild.id].warns += 1

        if(warnFile[user.id+message.guild.id].warns > warnFile[user.id+message.guild.id].maxwarn){
            if(message.guild.member(user).kickable == true){
                message.channel.send({content:`Der user <@!${user.id}> wurde gekickt wegen zu vielen verwarnungen.`})
                message.guild.member(user).kick("Zu viele verwarnungen.")
            }
        
            delete warnFile[user.id+message.guild.id]
        }

        fs.writeFile("pfad zur datei", JSON.stringify(warnFile), function(err){
            if(err) console.log(err)
        })
    
    }
})