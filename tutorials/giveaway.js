const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);
const g = require("pfad zur datei")

bot.on("messageCreate", async message=>{
    if(message.content.startsWith("!g create")){
        let channel = message.mentions.channels.first();
        let args = message.content.split(" ").slice(3).join(" ").split(",")
        let price = args[0];
        let duration = args[1];
        let winners = args[2];
        if(!channel) return message.channel.send({content:"Du hast keinen Kanal angegeben."});
        if(!price) return message.channel.send({content:"Du hast keinen Preis angegeben."});
        if(!duration) return message.channel.send({content:"Du hast keine dauer angegeben"});
        if(!winners) winners = 1;

        if(!g[message.guild.id]){
            g[message.guild.id] = []
        }

        g[message.guild.id].push({
            "channel":channel.id,
            "price":price,
            "winners":winners,
            "end":0,
            "members":[],
            "mId":0,
            "ended":false
        })

        let currentG = g[message.guild.id][g[message.guild.id].length-1];

        if(duration.toLowerCase().includes("s")){
            duration = Number(duration.split("s")[0])*1000
        }else if(duration.toLowerCase().includes("m")){
            duration = Number(duration.split("m")[0])*1000*60
        }else if(duration.toLowerCase().includes("h")){
            duration = Number(duration.split("h")[0])*1000*60*60
        }else if(duration.toLowerCase().includes("d")){
            duration = Number(duration.split("d")[0])*1000*60*60*24
        }else{
            duration = Number(duration)*1000*60
        }

        currentG.end = new Date().getTime() + duration;

        let time = Date.parse(new Date(new Date().getTime() + duration))/1000

        let em = new Discord.MessageEmbed()
        .setAuthor("🎉 GIVEAWAY 🎉")
        .setTitle(price.toString())
        .setDescription("Drücke auf den Knopf, um am Gewinnspiel teilzunehemn.\n**Giveaway endet**: <t:"+time+":R>\nGehostet von: <@!"+message.author.id+">")
        .setColor("BLUE")
        .setFooter(currentG.members.length+" Teilnehmer")
        .setTimestamp();

        let row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
            .setLabel("Teilnehmen")
            .setStyle("PRIMARY")
            .setCustomId("giveaway_teilnahme")
        )

        channel.send({embeds:[em], components:[row]}).then(msg=>{
            currentG.mId = msg.id

            fs.writeFileSync("pfad zur datei", JSON.stringify(g))
        })
    }

    if(message.content.startsWith("!g end")){
        if(!g[message.guild.id]) return message.channel.send({content:"Es gibt keine aktiven giveaways die du beenden könntest."});
        let away = message.content.split(" ").slice(2).join("")
        let giveaway;

        if(g[message.guild.id].length < 1) return message.channel.send({content:"Es gibt keine aktiven giveaways die du beenden könntest."})

        if(!away){
            giveaway = g[message.guild.id][g[message.guild.id].length-1];

            g[message.guild.id][g[message.guild.id].length-1].end = 0;
        }else{
            for(i=0;i<g[message.guild.id].length;i++){
                if(g[message.guild.id][i].mId == away){
                    giveaway = g[message.guild.id][i];
                    g[message.guild.id][i].end = 0;
                    break;
                }
            }
        }

        if(!giveaway || giveaway.ended == true) return message.channel.send({content:"Das giveaway wurde beendet oder existiert nicht"})
    
        message.channel.send({content:"Event beednet"})

        fs.writeFileSync("pfad zur datei", JSON.stringify(g))
    }

    if(message.content.startsWith("!g delete")){
        if(!g[message.guild.id]) return message.channel.send({content:"Es gibt keine aktiven giveaways die du löschen könntest."});
    
        let away = message.content.split(" ").slice(2).join("")
        let giveaway;

        if(g[message.guild.id].length < 1) return message.channel.send({content:"Es gibt keine aktiven giveaways die du beenden könntest."})

        if(!away){
            giveaway = g[message.guild.id][g[message.guild.id].length-1];

            g[message.guild.id].splice(g[message.guild.id].length-1,1)
        }else{
            for(i=0;i<g[message.guild.id].length;i++){
                if(g[message.guild.id][i].mId == away){
                    giveaway = g[message.guild.id][i];
                    g[message.guild.id].splice(i,1)
                    break;
                }
            }
        }

        if(!giveaway) return message.channel.send({content:"Das giveaway existiert nicht"})

        message.channel.send({content:"Event gelöscht."})

        fs.writeFileSync("pfad zur datei", JSON.stringify(g))
    }


    if(message.content.startsWith("!g reroll")){
        if(!g[message.guild.id]) return message.channel.send({content:"Es gibt keine aktiven giveaways wo du den gewinner neu ziehen kannst."});
    
        let away = message.content.split(" ").slice(2).join("")
        let giveaway;

        if(g[message.guild.id].length < 1) return message.channel.send({content:"Es gibt keine aktiven giveaways die du beenden könntest."})

        if(!away){
            giveaway = g[message.guild.id][g[message.guild.id].length-1];

            if(g[message.guild.id][g[message.guild.id].length-1].ended == false) return message.channel.send({content:"Das giveaway ist noch nicht vorbei."})
            if(g[message.guild.id][g[message.guild.id].length-1].members.length < 1) return message.channel.send({content:"Das giveaway hatte ekien teilnehmer."})
            g[message.guild.id][g[message.guild.id].length-1].ended = false;
            g[message.guild.id][g[message.guild.id].length-1].end = 0;
        }else{
            for(i=0;i<g[message.guild.id].length;i++){
                if(g[message.guild.id][i].mId == away){
                    giveaway = g[message.guild.id][i];
                    
                    if(g[message.guild.id][i].ended == false) return message.channel.send({content:"Das giveaway ist noch nicht vorbei."})
                    if(g[message.guild.id][i].members.length < 2) returnmessage.channel.send({content:"Das giveaway hatte ekien teilnehmer."})
                    g[message.guild.id][i].ended = false;
                    g[message.guild.id][i].end = 0;

                    break;
                }
            }
        }

        if(!giveaway) return message.channel.send({content:"Das giveaway existiert nicht"})

        message.channel.send({content:"Gewinner wird neu gezogen."})

        fs.writeFileSync("pfad zur datei", JSON.stringify(g))
    }
})

bot.on("interactionCreate", async interaction=>{
    //giveaway

    if(interaction.customId == "giveaway_teilnahme"){
        let gg;
        for(i=0;i<g[interaction.guild.id].length;i++){
            if(g[interaction.guild.id][i].mId == interaction.message.id){
                gg = g[interaction.guild.id][i];
                break;
            }
        }

        if(!gg || gg.ended == true) return interaction.reply({content:"Das giveaway ist bereits beednet worden.", ephemeral:true})
        
        if(gg.members.includes(interaction.user.id)){
            for(i=0;i<gg.members.length;i++){
                if(gg.members[i] == interaction.user.id){
                    gg.members.splice(i,1)
                    break;
                }
            }
            interaction.reply({content:"Du nimmst nun nicht mehr am gewinnspiel teil.", ephemeral:true})
        }else{
            gg.members.push(interaction.user.id)
            interaction.reply({content:"Du nimmst nun am gewinnspiel teil.", ephemeral:true})
        }

        let msg = await bot.channels.cache.get(gg.channel).messages.fetch(gg.mId);

        let embed = msg.embeds[0]
        embed.footer.text = gg.members.length+" Teilnehmer";

        msg.edit({embeds:[embed], components:msg.components})

        fs.writeFileSync("pfad zur datei", JSON.stringify(g))
    }
    
})

setInterval(()=>{
    Object.keys(g).forEach(away=>{
        for(i=0;i<g[away].length;i++){
            if(new Date().getTime() > g[away][i].end && g[away][i].ended == false){
                let winner = []
                if(g[away][i].members.length > 0){
                    while(winner.length < g[away][i].winners && winner.length < g[away][i].members.length){
                        for(o=0;o<g[away][i].winners;o++){
                            let winnerr = g[away][i].members[Math.floor(Math.random() * g[away][i].members.length)]

                            if(!winner.includes(winnerr)){
                                winner.push(winnerr)
                            }
                        }
                    }
                }

                let ch = bot.channels.cache.get(g[away][i].channel);

                if(ch){
                    if(g[away][i].members.length > 0){
                        ch.send({content:"Glückwunsch <@!"+winner.join(">, <@!")+">\n"+(winner.length == 1 ? "du hast " : "ihr habt ") + "__**"+g[away][i].price+"**__ gewonnen"})
                    }
                }

                g[away][i].ended = true;
                g[away][i].end = new Date().getTime();
                fs.writeFileSync("./giveaway.json", JSON.stringify(g));
            }else if(new Date().getTime() > g[away][i].end + 1000*60*60 && g[away][i].ended == true){
                g[away].splice(i,1);
                fs.writeFileSync("./giveaway.json", JSON.stringify(g));
            }
        }
    })
},1000)