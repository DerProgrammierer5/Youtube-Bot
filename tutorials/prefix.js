const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
const serverstats = require("pfad zur datei")
bot.login(token);

bot.on("messageCreate", async message=>{

    if(!serverstats[message.guild.id]){
        serverstats[message.guild.id] = {
            prefix:"!",
        }
    }

    fs.writeFile("pfad zur datei",JSON.stringify(serverstats),function(err){
        if(err) console.log(err);
    })

    let prefix = serverstats[message.guild.id].prefix;

    if(message.content === "prefix"){
        message.channel.send({content:"Die Prefix ist **"+serverstats[message.guild.id].prefix+"**"});
    }

    if(message.content.startsWith(prefix+"setprefix")){
        let newprefix = message.content.split(" ").slice(1).join("");

        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply({content:"Du hast keine Rechte!"});

        serverstats[message.guild.id].prefix = newprefix;

        message.channel.send({content:"Die neue Prefix ist **"+newprefix+"**."});

        fs.writeFile("pfad zur datei",JSON.stringify(serverstats),function(err){
            if(err) console.log(err);
        })
    }
})