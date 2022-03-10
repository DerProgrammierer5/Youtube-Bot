const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
const ascii = require("ascii-art");
bot.login(token);

bot.on("messageCreate", async message=>{
    if(message.content.startsWith(prefix+"ascii")){
        let content = message.content.split(" ").slice(1).join(" ");

        if(!content) return message.reply({content:"Du hast vergessen anzugeben was ich schreiben soll."}).then(msg=>msg.delete({timeout:"5000"}));

        ascii.font(content,"Doom",function(err,result){
            if(err){
                return message.channel.send({content:"Error: "+err});
            }
            message.channel.send({content:result, 
                code: "md"
            })
        })

    }
})