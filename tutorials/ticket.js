const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);

bot.on("messageCreate", async message=>{
    if(message.content.startsWith("!ticket setup")){
        let channel = message.mentions.channels.first()
        let kate;
        let modrole = message.mentions.roles;

        message.guild.channels.cache.forEach(chn=>{
            if(chn.type == "GUILD_CATEGORY" && !kate && chn.name.toLowerCase() == "tickets"){
                kate = chn;
            }
        })

        if(!channel) return message.channel.send({content:"Du musst einen kanal anegeben, wo die nachricht reingesendt werden sol."});

        if(!kate){
            await message.guild.channels.create("tickets", {
                type:"GUILD_CATEGORY",
                permissionOverwrites:[
                    {id:message.guild.id, deny:["VIEW_CHANNEL"]},
                    {id:bot.user.id,allow:["VIEW_CHANNEL"]}
                ]
            }).then(l=>kate=l);
        }

        if(!tickets[message.guild.id]){
            tickets[message.guild.id] = {
                id:0,
                access:[]
            }
        }

        let l = [{
            id:message.guild.id, 
            deny:["VIEW_CHANNEL"]
        },
        {
            id:bot.user.id,
            allow:["VIEW_CHANNEL"]
        }]

        modrole.forEach(role=>{
            l.push({id:role.id, allow:["VIEW_CHANNEL"]})
        })

        tickets[message.guild.id].id = kate.id

        tickets[message.guild.id].access = l

        fs.writeFileSync("./tickets.json", JSON.stringify(tickets));

        let button = new Discord.MessageButton()
        .setLabel("Erstelle ein Ticket")
        .setCustomId("create_ticket_button")
        .setStyle("SECONDARY")
        .setEmoji("📩")

        let row = new Discord.MessageActionRow()
        .addComponents(button);

        let embed = new Discord.MessageEmbed()
        .setTitle("Tickets")
        .setDescription("Drücke auf 'Ticket erstellen' um ein Ticket zu erstellen.")
        .setColor("BLUE")
        .setTimestamp()

        channel.send({embeds:[embed], components:[row]});

    }
})

bot.on("interactionCreate", async interaction=>{
    if(interaction.customId == "create_ticket_button"){
        interaction.deferUpdate();
        if(tickets[interaction.guild.id]){
            if(!bot.channels.cache.get(tickets[interaction.guild.id].id)){
                await interaction.guild.channels.create("tickets", {
                    type:"GUILD_CATEGORY",
                    permissionOverwrites:[
                        {id:interaction.guild.id, deny:["VIEW_CHANNEL"]},
                        {id:bot.user.id,allow:["VIEW_CHANNEL"]}
                    ]
                }).then(l=>tickets[interaction.guild.id].id = l.id)
            }

            tickets[interaction.guild.id].access.push({id:interaction.user.id, allow:["VIEW_CHANNEL"]});

            interaction.guild.channels.create("ticket-"+Math.floor(Math.random() * 1000), {
                type:"GUILD_TEXT",
                parent:bot.channels.cache.get(tickets[interaction.guild.id].id),
                permissionOverwrites:tickets[interaction.guild.id].access
            }).then(chn=>{
                let embed = new Discord.MessageEmbed()
                .setTitle("Tickets")
                .setDescription("Press :x: to close the ticket.")
                .setColor("BLUE")
                .setTimestamp();

                let row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setLabel("Close")
                    .setCustomId("close_ticket_button")
                    .setStyle("DANGER")
                    .setEmoji("❌")
                )

                chn.send({content:"@here", embeds:[embed], components:[row]})
            })
            tickets[interaction.guild.id].access.splice(tickets[interaction.guild.id].access.length - 1, 1);
        }
    }

    if(interaction.customId == "close_ticket_button"){
        interaction.channel.delete()
    }
})