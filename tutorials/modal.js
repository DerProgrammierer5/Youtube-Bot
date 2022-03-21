const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC";     
const fs = require("fs");                                                                                                                                                                                            
const modal = require("discord-modals")
modal(bot);
bot.login(token);

bot.on("ready", () =>{
    console.log("ACHTUNG!!! Bot ist gestrtet!");
    //erstellt einen guild slash command. Wenn ihr das nicht braucht macht es weg
    bot.guilds.cache.get("die guild id").commands.set([{"name":"bewerben","description":"Bewerbe dich als Mod","type":"CHAT_INPUT"}])
})

bot.on("interactionCreate", async interaction =>{
    if(interaction.isCommand()){
        if(interaction.commandName == "bewerben"){
            let m = new modal.Modal()
            .setCustomId('bewerbung')
            .setTitle('Berbe dich als Admin')
            .addComponents([
                new modal.TextInputComponent()
                .setCustomId('frage1')
                .setLabel('1. Warum Sollten wir dich nehmen')
                .setStyle('LONG')
                .setMinLength(50)
                .setMaxLength(500)
                .setPlaceholder('Schreibe hier deine Antwort')
                .setRequired(true)
            ])

            modal.showModal(m, {
                client: bot,
                interaction: interaction
            })
        }
    }
})

bot.on('modalSubmit', async (modal) => {
    if(modal.customId === 'bewerbung'){
      const firstResponse = modal.getTextInputValue('frage1')

      modal.deferReply({"ephemeral":true}).then(()=>{
          modal.followUp({"content":"Deine Bewerbung wurde erfolgreich entgegen genommen"})
      })
    }
});