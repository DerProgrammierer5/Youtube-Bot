const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);

bot.on("messageCreate", async message=>{
    if(message.content === "!verify"){

        message.channel.send({content:"Klicke auf den 👍 um dich zu verifizieren und auf den 👎 um es abzubrechen."}).then(msg=>{

            msg.react("👍").then(()=>{
                msg.react("👎");
            });

            const filter = (reaction, user) =>{
                return ["👍","👎"].includes(reaction.emoji.name) && user.id === message.author.id;
            }

            msg.awaitReactions(filter,{time:30000, max:1}).then(collected=>{
                const reaction = collected.first();

                switch(reaction.emoji.name){
                    case "👍": message.channel.send({content:"Du wurdest verifiziert!"});
                            reaction.users.remove(message.author);
                        break;
                    case "👎": message.channel.send({content:"Vorgang abgebrochen"});
                        reaction.users.remove(message.author);
                        break;
                }

            }).catch(err=>{
                if(err) message.channel.send({content:"Zeit ist um!"});
            })

        })

    }
})