const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);

bot.on("messageCreate", async message=>{
    if(message.content == "menu"){
        let row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageSelectMenu()
            .setCustomId("menu")
            .setPlaceholder("Klicke hier um etwas auszuwähölen")
            .addOptions([
                {
                    label:"Option 1",
                    emoji:"🧡",
                    value:"option_1"
                },{
                    label:"Option 2",
                    emoji:"❤",
                    value:"option_2"
                },{
                    label:"Option 3",
                    emoji:"🕳",
                    value:"option_3"
                }
            ])
        )
        message.channel.send({content:"Klicke ier",components:[row]})

        let collector = message.channel.createMessageComponentCollector({filter:m=>m.member.id == message.member.id, max:1,time:10000});

        collector.on("collect", interaction=>{
            if(interaction.values[0] == "option_1"){
                let role = interaction.guild.roles.cache.get("572441267708100618")
                interaction.member.roles.add(role).catch(err=>{
                    if(err) return message.channel.send("Error beim hinzufügen");
                })
                interaction.reply({content:"Rolle hinzugefügt", ephemeral:true})
            }
        })
    }
})