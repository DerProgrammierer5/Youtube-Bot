const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);

bot.on("messageCreate", async message=>{
    if(message.content == "!button"){
        let row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
            .setCustomId("greenButton")
            .setStyle("SUCCESS")
            .setLabel("GRÜN"),

            new Discord.MessageButton()
            .setCustomId("redButton")
            .setStyle("DANGER")
            .setLabel("ROT")
        )

        message.channel.send({content:"hallo", components:[row]}).then(msg=>{
            let collector = msg.channel.createMessageComponentCollector({filter:button=>button.user.id == message.author.id && button.message.id == msg.id,time:60000});

            collector.on("collect", async button=>{
                if(button.customId == "greenButton"){
                    button.reply({content:"GRÜN"})
                }else{
                    button.reply({content:"ROT"})
                }
            })
        })
    }
})