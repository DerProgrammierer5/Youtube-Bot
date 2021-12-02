const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES], "partials":["MESSAGE","CHANNEL"]});
const token =  "weg xd"
const fs = require("fs");
const coinfile = require("./coins.json");
const xpfile = require("./xp.json")
const warnFile = require("./warns.json")
const serverstats = require("./servers.json");
const ascii = require("ascii-art");
const slash = require("slash_commands.js")
const tickets = require("./tickets.json")
const g = require("./giveaway.json")

const ranks = ["Player",0,"Premium",100,"VIP",5000, "list"];


bot.on("ready", () =>{
    console.log("ACHTUNG!!! Bot ist gestrtet!");

    //wechselnder status

    let statuse = [
    "Hi!",
    `auf ${bot.guilds.cache.size} Servern`,
    `mit ${bot.users.cache.size} Usern`
    ]

    let number = 0;

    bot.user.setActivity(statuse[statuse.length]);

    setInterval(()=>{
        let rstatus = statuse[number];

        bot.user.setActivity(rstatus);

        number++;

        if(number >= statuse.length){
            number = 0;
        }
    },5000)
})

bot.on("messageCreate", async message =>{

    if(message.channel.name !== "youtube-test" && message.guild.id === "567548294054543381") return;

    if(!coinfile[message.author.id]){
        coinfile[message.author.id] = {
            coins: 100
        }
    }

    fs.writeFile("./coins.json", JSON.stringify(coinfile), err =>{
        if(err){
            console.log(err);
        }
    })

    if(!serverstats[message.guild.id]){
        serverstats[message.guild.id] = {
            prefix:"!",
            welcomechannel:"nochannel",
            globalchat:"noID"
        }
    }

    fs.writeFile("./servers.json", JSON.stringify(serverstats), err =>{
        if(err){
            console.log(err);
        }
    })

    if(!warnFile[message.author.id+message.guild.id]){
        warnFile[message.author.id+message.guild.id] = {
            warns:0,
            maxwarn:3
        }
    }

    fs.writeFile("./warns.json", JSON.stringify(warnFile), function(err){
        if(err) console.log(err)
    })


    let prefix = serverstats[message.guild.id].prefix;

    if(message.content === `${prefix}help`){
        let embed = new Discord.MessageEmbed()
        .setTitle("**Die Hilfe**")
        .addField("Hilfe:", "Es gibt keine Hilfe.", true)
        .addField("Hilfe1:", "Es gibt keine Hilfe.2", true)
        .addField("Hilfe2:", "Es gibt keine Hilfe.3", true)
        .addField("Hilfe3:", "Es gibt keine Hilfe.4", true)
        .addField("Hilfe4:", "Es gibt keine Hilfe.5", true)
        .setColor("RANDOM")
        .setFooter(":D")
        .setThumbnail("https://i.ibb.co/x1gM4RG/roulette-rad.gif")

        message.channel.send({embeds:[embed]});
    }

    if(message.content.startsWith("!flip")){

        if(!coinfile[message.author.id]){
            coinfile[message.author.id] = {
                coins: 100
            }
        }

        let bounty = message.content.split(" ").slice(1, 2).join("");

        let val = message.content.split(" ").slice(2, 3).join("");

        bounty = Number(bounty)

        if(isNaN(bounty)) return message.reply({content:"Du hast keine Zahl für Coins angegeben. Du hast **"+ bounty+"** angegeben."})

        if(!bounty) return message.reply({content:"Du hast keine Coins angegeben."});

        if(!val) return message.reply({content:"Du hast kein Kopf oder zahl angegeben."});

        if(coinfile[message.author.id].coins < bounty) return message.reply({content:"Du hast zu wenig Coins!"});

        coinfile[message.author.id].coins -= bounty;

        coinfile[message.author.id].coins = Number(coinfile[message.author.id].coins)

        let chance = Math.floor(Math.random() * 2);

        if(chance == 0){
            if(val.toLowerCase() == "kopf"){
                message.reply({content:"Und es ist... **Kopf**! Dein Einsatz verdoppelt sich."});

                bounty = bounty *2

                coinfile[message.author.id].coins += bounty;

                coinfile[message.author.id].coins = Number(coinfile[message.author.id].coins)

            }else{

                if(val.toLowerCase() == "zahl"){
                    message.reply({content:"Und es ist... **Kopf**! Du hast verloren."})
                }else{
                    coinfile[message.author.id].coins += bounty

                    coinfile[message.author.id].coins = Number(coinfile[message.author.id].coins)
                    message.reply({content:"Du hast **Kopf** oder **Zahl** falsch geschrieben oder an die falsche Stelle gesetzt."})
                }

            }
        }else{

            if(val.toLowerCase() == "zahl"){
                message.reply({content:"Und es ist... **Zahl**! Dein Einsatz verdoppelt sich."});

                bounty = bounty *2

                coinfile[message.author.id].coins += bounty;

                coinfile[message.author.id].coins = Number(coinfile[message.author.id].coins)

            }else{

                if(val.toLowerCase() == "kopf"){
                    message.reply({content:"Und es ist... **Zahl**! Du hast verloren."})
                }else{
                    coinfile[message.author.id].coins += bounty

                    coinfile[message.author.id].coins = Number(coinfile[message.author.id].coins)

                    message.reply({content:"Du hast **Kopf** oder **Zahl** falsch geschrieben oder an die falsche Stelle gesetzt."})
                }

            }

        }

        fs.writeFile("./coins.json", JSON.stringify(coinfile), err =>{
            if(err){
                console.log(err);
            }
        })

    }


    if(message.content === "!coins"){
        let embed = new Discord.MessageEmbed()
        .setTitle("Coins von " + message.author.username)
        .setDescription("Deine Coins: " + coinfile[message.author.id].coins)
        .setColor("YELLOW")

        message.channel.send({embeds:[embed]});
    }

    if(message.content.startsWith("!clear")){
        let messages = message.content.split(" ").slice(1).join("");

        if(isNaN(messages)) return message.reply({content:"Du hast keine Zahl angegeben, sonder Buchstaben."}).then(msg=>msg.delete({timeout:"5000"}));
        
        message.channel.bulkDelete(messages);

        message.channel.send({content:"Habe " + messages + " Nachrichten gelöscht."}).then(msg=>msg.delete({timeout:"5000"}));
    }

    if(message.content === "!serverinfo"){
        if(!message.guild) return;

        let server = {
            logo: message.guild.iconURL(),
            name: message.guild.name,
            createdAt: message.guild.createdAt,
            id: message.guild.id,
            owner: message.guild.owner.user.username,
            region: message.guild.region,
            verified:  message.guild.verified,
            members: message.guild.memberCount
        }

        let embed = new Discord.MessageEmbed()
        .setTitle("**ServerInfo**")
        .setColor("RANDOM")
        .setThumbnail(server.logo)
        .addField("**Name**: ",server.name, true)
        .addField("**Id**: ",server.id, true)
        .addField("**Owner**: ",server.owner, true)
        .addField("**Region**: ",server.region, true)
        .addField("**Verifiziert**: ",server.verified, true)
        .addField("**Mitglieder**: ",server.members, true)
        .addField("**Erstellt am**: ",server.createdAt, true)

        message.channel.send({embeds:[embed]});
    }



    if(message.content.startsWith("!user")){
        let user = message.mentions.users.first() || message.author

        let userinfo = {
            avatar: user.avatarURL(),
            name: user.username,
            discrim: `#${user.discriminator}`,
            id: user.id,
            status: user.presence.status,
            bot: user.bot,
            erstelltAm: user.createdAt,
        }

        let embed = new Discord.MessageEmbed()
        .setThumbnail(userinfo.avatar)
        .setColor("RANDOM")
        .addField("Username:", userinfo.name, true)
        .addField("Discriminator:", userinfo.discrim, true)
        .addField("ID:", userinfo.id, true)
        .addField("Status:", userinfo.status, true)
        .addField("BOT:", userinfo.bot, true)
        .addField("Created at:", userinfo.erstelltAm, true)

        message.channel.send({embeds:[embed]});
    }

    if(message.content === "!ping"){
        message.channel.send({content:"Pong! :ping_pong: Dauerte "+bot.ws.ping+"ms"});
    }

    if(message.content.startsWith("!react")){

        let text = message.content.split(" ").slice(1).join(" ");

        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply({content:"Du hast keine Rechte dafür!"});

        message.channel.send({content:text}).then(msg=>{
            msg.react('👍');
        })
    }

    if(message.content.startsWith("!kick")){
        message.delete()
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply({content:"Du hast keine Rechte dafür!"}).then(msg=>msg.delete({timeout:"5000"}));

        let user = message.mentions.members.first();

        if(!user) return message.reply({content:"Du hast vergessen einen Nutzer anzugeben!"}).then(msg=>msg.delete({timeout:"5000"}));

        message.guild.member(user).kick().catch(err=>{
            if(err){
                message.channel.send({content:"Konnte den Nutzer nicht kicken: "+err}).then(msg=>msg.delete({timeout:"10000"}));
            }else{
                message.channel.send({content:"Erfolgreich den Nutzer gekickt!"}).then(msg=>msg.delete({timeout:"5000"}));
            }
        })
    }

    if(message.content.startsWith("!ban")){
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply({content:"Du hast keine Rechte dafür!"}).then(msg=>msg.delete({timeout:"5000"}));

        let user = message.mentions.members.first();

        if(!user) return message.reply({content:"Du hast vergessen einen Nutzer anzugeben!"})

        message.guild.member(user).ban().catch(err=>{
            if(err){
                message.channel.send({content:"Konnte den Nutzer nicht bannen: "+err}).then(msg=>msg.delete({timeout:"10000"}));
            }else{
                message.channel.send({content:"Erfolgreich den Nutzer gebannt!"}).then(msg=>msg.delete({timeout:"5000"}));
            }
        })
    }

    //rang system

    if(message.content.startsWith("!buyrank")){
        let rank;
        let mrank = message.content.split(" ").slice(1).join(" ");
        if(!mrank) return message.reply({content:"Du hast keinen Rang zum kaufen angegeben."}).then(msg=>msg.delete({timeout:"5000"}));

        for(var i=0;i<ranks.length;i++){
            if(isNaN(ranks[i])){
                if(mrank.toLowerCase() == ranks[i].toLowerCase()){
                    rank = ranks[i];
                    break;
                }
            }
        }

        if(!rank){
            return message.reply({content:"Dieser Rang existiert nicht. Bekomme eine Liste mit den Rängen mit !buyrank list"}).then(msg=>msg.delete({timeout:"5000"}));
        }else{

            for(var i=0;i<ranks.length;i++){
                if(isNaN(ranks[i]) && ranks[i] !== "list"){
                    if(rank == ranks[i]){
                        if(coinfile[message.author.id].coins < ranks[i+1]){
                            return message.reply({content:"Du hast zu wenig Geld dafür!"}).then(msg=>msg.delete({timeout:"5000"}));
                        }

                        let name = message.member.nickname || message.author.username;

                        if(name.includes(ranks[i].toUpperCase())){
                            message.reply({content:"Du hast diesen Rang bereits!"}).then(msg=>msg.delete({timeout:"5000"}));
                            return;
                        }

                        coinfile[message.author.id].coins -= ranks[i+1];

                        let coins = ranks[i+1];

                        //mit rolle
                        let role = message.guild.roles.cache.find(rl=>rl.name===ranks[i])

                        if(role){
                            message.member.roles.add(role).catch(err);
                        }

                        //mit nickname

                        if(message.member.nickname){
                            message.member.setNickname("");
                            name = message.author.username;
                        }

                        message.member.setNickname(`[${ranks[i].toUpperCase()}] ${name}`).then(()=>{
                            message.channel.send({content:`Erfolgreich den rang ${rank} gekauft!`}).then(msg=>msg.delete({timeout:"5000"}));
                        }).catch(err=>{
                            if(err){
                                message.channel.send({content:"Konnte den Rang nicht hinzufügen: "+err})
                                coinfile[message.author.id].coins += coins;
                                return;
                            }
                        })
                    }
                }
            }

            if(rank == "list"){
                let list = "";

                for(var i=0;i<ranks.length;i++){
                    if(isNaN(ranks[i]) && ranks[i] !== "list"){
                        list+= `-${ranks[i]} - ${ranks[i+1]}\n\n`
                    }
                }

                let embed = new Discord.MessageEmbed()
                .setTitle("Liste mit Rängen")
                .setColor("GREY")
                .setDescription("Hier ist eine Liste mit allen Rängen:\n\n"+list)

                message.channel.send({embeds:[embed]})
            }
        }

        fs.writeFile("./coins.json",JSON.stringify(coinfile),function(err){
            if(err) console.log(err)
        })

    }

    //prefix änderer

    if(message.content === "prefix"){
        message.channel.send({content:"Die Prefix ist **"+serverstats[message.guild.id].prefix+"**"});
    }

    if(message.content.startsWith(prefix+"setprefix")){
        let newprefix = message.content.split(" ").slice(1).join("");

        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply({content:"Du hast keine Rechte!"});

        serverstats[message.guild.id].prefix = newprefix;

        message.channel.send({content:"Die neue Prefix ist **"+newprefix+"**."});

        fs.writeFile("./servers.json",JSON.stringify(serverstats),function(err){
            if(err) console.log(err);
        })
    }


    //global chat

    //setup

    if(message.content.startsWith(prefix+"globalsetup")){
        let channel = message.mentions.channels.first();
        if(!channel) return message.channel.send({content:"Du hast keinen Kanal aneggeben."}).then(msg=>msg.delete({timeout:"5000"}));
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send({content:"Du hast keien Rechte dafür."}).then(msg=>msg.delete({timeout:"5000"}));
        if(!serverstats[message.guild.id].globalchat){
            serverstats[message.guild.id].globalchat = "noID"
        }
        serverstats[message.guild.id].globalchat = channel.id;
        message.channel.send({content:"Der Globalchat ist nun <#"+channel.id+">."}).then(msg=>msg.delete({timeout:"8000"}));
    }

    //unsetup

    if(message.content.startsWith(prefix+"globalunsetup")){
        if(!message.member.hasPermission("MANAGE_CHANNELS")) return message.channel.send({content:"Du hast keien Rechte dafür."}).then(msg=>msg.delete({timeout:"5000"}));
        if(!serverstats[message.guild.id].globalchat){
            serverstats[message.guild.id].globalchat = "noID"
        }
        serverstats[message.guild.id].globalchat = "noID";
        message.channel.send({content:"Der Globalchat wurde geunsetupped."}).then(msg=>msg.delete({timeout:"8000"}));
    }

    //globalchat

    if(message.channel.id === serverstats[message.guild.id].globalchat && !message.content.startsWith(prefix) && !message.author.bot){
        bot.guilds.cache.forEach(guild=>{
            if(guild.id !== message.guild.id){
                if(serverstats[guild.id].globalchat){
                    if(serverstats[guild.id].globalchat != "NoID"){
                        if(guild.channels.cache.get(serverstats[guild.id].globalchat)){
                            let embed = new Discord.MessageEmbed()
                            .setAuthor(message.author.tag)
                            .setTitle("GLOBALCHAT")
                            .setColor("RANDOM")
                            .setDescription(message.content)
                            .setFooter("Guild: "+message.guild.name, message.guild.iconURL())
                            .setThumbnail(message.author.displayAvatarURL({dynamic:true}))
                            .setTimestamp()
                            guild.channels.cache.get(serverstats[guild.id].globalchat).send({embeds:[embed]});
                        }
                    }
                }
            }
        })
    }

    //message abwarten

    if(message.content === "!widerhole"){
        message.reply({content:"Sage was ich sagen soll, du hast 30 Sekunden!"});

        const filter = m => m.author.id === message.author.id;

        message.channel.awaitMessages(filter, {max:1,time:5*1000}).then(collections=>{
            let gesmessage = collections.first().content;

            if(gesmessage === "cancel") return message.channel.send({content:"Erfolgreich abgebrochen!"}).then(msg=>msg.delete({timeout:"5000"}));

            message.channel.send({content:"Du sagtest: "+gesmessage});
        }).catch(err=>{
            if(err) return message.reply({content:"Die zeit ist abgelaufen!"}).then(msg=>msg.delete({timeout:"5000"}));
        })
    }

    //ascii

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

    //ticket system

    if(message.content.startsWith(prefix+"createticket")){
        let rawusername = message.author.username.split("").slice(0);

        let username = "";

        for(i=0;i<rawusername.length;i++){
            if(rawusername[i].toLowerCase() == "a"
            || rawusername[i].toLowerCase() == "b"
            || rawusername[i].toLowerCase() == "c"
            || rawusername[i].toLowerCase() == "d"
            || rawusername[i].toLowerCase() == "e"
            || rawusername[i].toLowerCase() == "f"
            || rawusername[i].toLowerCase() == "g"
            || rawusername[i].toLowerCase() == "h"
            || rawusername[i].toLowerCase() == "i"
            || rawusername[i].toLowerCase() == "j"
            || rawusername[i].toLowerCase() == "k"
            || rawusername[i].toLowerCase() == "l"
            || rawusername[i].toLowerCase() == "m"
            || rawusername[i].toLowerCase() == "n"
            || rawusername[i].toLowerCase() == "o"
            || rawusername[i].toLowerCase() == "p"
            || rawusername[i].toLowerCase() == "q"
            || rawusername[i].toLowerCase() == "r"
            || rawusername[i].toLowerCase() == "s"
            || rawusername[i].toLowerCase() == "t"
            || rawusername[i].toLowerCase() == "u"
            || rawusername[i].toLowerCase() == "v"
            || rawusername[i].toLowerCase() == "w"
            || rawusername[i].toLowerCase() == "x"
            || rawusername[i].toLowerCase() == "y"
            || rawusername[i].toLowerCase() == "z"
            || rawusername[i].toLowerCase() == "0"
            || rawusername[i].toLowerCase() == "1"
            || rawusername[i].toLowerCase() == "2"
            || rawusername[i].toLowerCase() == "3"
            || rawusername[i].toLowerCase() == "4"
            || rawusername[i].toLowerCase() == "5"
            || rawusername[i].toLowerCase() == "6"
            || rawusername[i].toLowerCase() == "7"
            || rawusername[i].toLowerCase() == "8"
            || rawusername[i].toLowerCase() == "9"){
                username+=rawusername[i].toLowerCase();
            }
        }

        if(message.channel.name !== "ticket") return message.reply({content:"Du kannst in diesem Kanal kein ticket erstellen!"}).then(msg=>msg.delete({timeout:"5000"}));

        message.delete();

        let category = message.guild.channels.cache.find(ct=>ct.name === "tickets" && ct.type === "category");

        if(!category) await message.guild.channels.create("tickets", {type:"category"}).then(cat=>category = cat);

        if(message.guild.channels.cache.find(cha=>cha.name===`ticket-${username.toLowerCase()}`)) return message.reply({content:"Du hast bereits ein ticket erstellt!"}).then(msg=>msg.delete({timeout:"5000"}));

        let supporterRole = message.guild.roles.cache.find(rl=>rl.name ==="Supporter");

        if(!supporterRole) return message.reply({content:"Ich konnte keine Supporter rolle finden!"}).then(msg=>msg.delete({timeout:"5000"}));

        await message.guild.channels.create(`ticket-${message.author.username}`,{type:"text"}).then(ch=>{
            ch.setParent(category);
            ch.overwritePermissions([
                {
                    id:message.guild.id,
                    deny:["SEND_MESSAGES","VIEW_CHANNEL","ATTACH_FILES"]
                },
                {
                    id:message.author.id,
                    allow:["SEND_MESSAGES","VIEW_CHANNEL","ATTACH_FILES"]
                }
            ]);

            ch.send({content:`Hey <@&${supporterRole.id}>, hier braucht jemand hilfe!`});
        }).catch(err=>{
            if(err) return message.channel.send({content:"Ein fehler ist aufgetreten: "+err});
        })

        message.reply({content:"Ein ticket wurde erstellt. Bitte begebe dich in diesem text kanal und beschreibe dein problem"}).then(msg=>msg.delete({timeout:"9000"}));
    }


    if(message.content.startsWith("!closeticket")){
        let rawusername = message.author.username.split("").slice(0);

        let username = "";

        for(i=0;i<rawusername.length;i++){
            if(rawusername[i].toLowerCase() == "a"
            || rawusername[i].toLowerCase() == "b"
            || rawusername[i].toLowerCase() == "c"
            || rawusername[i].toLowerCase() == "d"
            || rawusername[i].toLowerCase() == "e"
            || rawusername[i].toLowerCase() == "f"
            || rawusername[i].toLowerCase() == "g"
            || rawusername[i].toLowerCase() == "h"
            || rawusername[i].toLowerCase() == "i"
            || rawusername[i].toLowerCase() == "j"
            || rawusername[i].toLowerCase() == "k"
            || rawusername[i].toLowerCase() == "l"
            || rawusername[i].toLowerCase() == "m"
            || rawusername[i].toLowerCase() == "n"
            || rawusername[i].toLowerCase() == "o"
            || rawusername[i].toLowerCase() == "p"
            || rawusername[i].toLowerCase() == "q"
            || rawusername[i].toLowerCase() == "r"
            || rawusername[i].toLowerCase() == "s"
            || rawusername[i].toLowerCase() == "t"
            || rawusername[i].toLowerCase() == "u"
            || rawusername[i].toLowerCase() == "v"
            || rawusername[i].toLowerCase() == "w"
            || rawusername[i].toLowerCase() == "x"
            || rawusername[i].toLowerCase() == "y"
            || rawusername[i].toLowerCase() == "z"
            || rawusername[i].toLowerCase() == "0"
            || rawusername[i].toLowerCase() == "1"
            || rawusername[i].toLowerCase() == "2"
            || rawusername[i].toLowerCase() == "3"
            || rawusername[i].toLowerCase() == "4"
            || rawusername[i].toLowerCase() == "5"
            || rawusername[i].toLowerCase() == "6"
            || rawusername[i].toLowerCase() == "7"
            || rawusername[i].toLowerCase() == "8"
            || rawusername[i].toLowerCase() == "9"){
                username+=rawusername[i].toLowerCase();
            }
        }

        if(!message.channel.name.includes("ticket") || message.channel.name === "ticket") return;

        if(message.channel.name !== `ticket-${username.toLowerCase()}` && !message.member.roles.cache.find(rl=>rl.name==="Supporter")) return message.reply({content:"Dies ist nicht dein ticket. Du kannst es also auch nicht beenden."}).then(msg=>msg.delete({timeout:"5000"}));

        await message.channel.send({content:"Ticket wird geschlossen..."});

        await message.channel.delete().catch(err=>{
            if(err) return console.error("Es ist ein fehler beim löschen des kanals passiert: "+err);
        })

    }



    //setup


    if(message.content.startsWith(prefix+"setup")){
        if(!serverstats[message.guild.id].welcomechannel){
            serverstats[message.guild.id].welcomechannel = "nochannel"
        }

        let newchannel = message.mentions.channels.first();

        if(!newchannel) return message.reply({content:"Du hast keinen Kanal angegeben!"}).then(msg=>msg.delete({timeout:"5000"}));
    
        serverstats[message.guild.id].welcomechannel = newchannel.name;

        message.channel.send({content:"Der welcome channel ist nun "+newchannel.name})/*.then(msg=>msg.delete({timeout:"5000"}));*/

        fs.writeFile("./servers.json", JSON.stringify(serverstats), function(err){
            if(err) console.log(err);
        })
    }


    //reaktionen abwarten

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
    
    //warn system


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

        fs.writeFile("./warns.json", JSON.stringify(warnFile), function(err){
            if(err) console.log(err)
        })
    
    }

    //buttons

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
            let collector = msg.channel.createMessageComponentCollector(button=>button.user.id == message.author.id && button.message.id == msg.id, {time:60000});

            collector.on("collect", async button=>{
                if(button.customId == "greenButton"){
                    button.reply({content:"GRÜN"})
                }else{
                    button.reply({content:"ROT"})
                }
            })
        })
    }

    //ticket 

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

if(message.content.startsWith("!g create")){
        let channel = message.mentions.channels.first()
        let args = message.content.split(" ").slice(3).join(" ").split(",")
        let price = args[0]
        let duration = args[1]
        let winners = args[2]
        if(!channel) return message.channel.send({content:"Du hast keinen Kanal angegeben."});
        if(!price) return message.channel.send({content:"Du hast keinen Preis angegeben."});
        if(!duration) return message.channel.send({content:"Du hast keine dauer angegeben"});
        if(!winners) {winners = 1};
        

        if(!g[message.guild.id]){
            g[message.guild.id] = []
        }

        g[message.guild.id].push({
            "channel":channel.id,
            "winners":winners,
            "end":0,
            "price":price,
            "members":[],
            "mId":0,
            "ended":false
        })

        let currentG = g[message.guild.id][g[message.guild.id].length-1]

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
        .setDescription("Drücke auf den Knopf, um am Gewinnspiel teilzunehmen.\n**Giveaway endet**: <t:"+time+":R>\nGehostet von <@!"+message.author+">")
        .setColor("BLUE")
        .setFooter(currentG.members.length+" Teilnehmer")
        .setTimestamp()

        let row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
            .setLabel("Teilnehmen")
            .setStyle("PRIMARY")
            .setCustomId("giveaway_teilnahmne")
        )

        channel.send({embeds:[em], components:[row]}).then(msg=>{
            currentG.mId = msg.id

            fs.writeFileSync("./giveaway.json", JSON.stringify(g))
        });
    }

    if(message.content.startsWith("!g end")){
        if(!g[message.guild.id]) return message.channel.send({content:"Es gibt keine aktiven giveaways die du beenden könntest."});
        let away = message.content.split(" ").slice(2).join("")
        let giveaway;
        if(g[message.guild.id].length < 1)  return message.channel.send({content:"Es gibt keine aktiven giveaways die du beenden könntest."});
        if(!away){
            giveaway = g[message.guild.id][g[message.guild.id].length-1];
            g[message.guild.id][g[message.guild.id].length-1].end = 0;
        }else{
            for(i=0;i<g[message.guild.id].length;i++){
                if(g[message.guild.id][i].mId == away){
                    giveaway = g[message.guild.id][i]
                    g[message.guild.id][i].end = 0;
                    break;
                }
            }
        }

        if(!giveaway || giveaway.ended == true) return message.channel.send({content:"Das giveaway wurde beendet oder existiert nicht"})

        message.channel.send({content:"Event beendet."})

        fs.writeFileSync("./giveaway.json", JSON.stringify(g))
        
    }

    if(message.content.startsWith("!g delete")){
        if(!g[message.guild.id]) return message.channel.send({content:"Es gibt keine aktiven giveaways die du beenden könntest."});
        let away = message.content.split(" ").slice(2).join("")
        let giveaway;
        if(g[message.guild.id].length < 1)  return message.channel.send({content:"Es gibt keine aktiven giveaways die du beenden könntest."});
        if(!away){
            giveaway = g[message.guild.id][g[message.guild.id].length-1];
            g[message.guild.id].splice(g[message.guild.id].length-1,1)
        }else{
            for(i=0;i<g[message.guild.id].length;i++){
                if(g[message.guild.id][i].mId == away){
                    giveaway = g[message.guild.id][i]
                    g[message.guild.id].splice(i,1)
                    break;
                }
            }
        }

        if(!giveaway) return message.channel.send({content:"Das giveaway mit der id existiert nicht"})

        message.channel.send({content:"Event gelöscht."})

        fs.writeFileSync("./giveaway.json", JSON.stringify(g))
    }

    if(message.content.startsWith("!g reroll")){
        if(!g[message.guild.id]) return message.channel.send({content:"Es gibt keine aktiven giveaways die du beenden könntest."});
        let away = message.content.split(" ").slice(2).join("")
        let giveaway;
        if(g[message.guild.id].length < 1)  return message.channel.send({content:"Es gibt keine aktiven giveaways die du beenden könntest."});
        if(!away){
            giveaway = g[message.guild.id][g[message.guild.id].length-1];
            if(g[message.guild.id][g[message.guild.id].length-1].ended == false) return message.channel.send({content:"Das giveaway ist noch nicht vorbei."})
            if(g[message.guild.id][g[message.guild.id].length-1].members.length < 1) return message.channel.send({content:"Das giveaway hatte keine Teilnehmer."})
            g[message.guild.id][g[message.guild.id].length-1].ended = false;
            g[message.guild.id][g[message.guild.id].length-1].end = 0
        }else{
            for(i=0;i<g[message.guild.id].length;i++){
                if(g[message.guild.id][i].mId == away){
                    giveaway = g[message.guild.id][i]
                    if(g[message.guild.id][i].ended == false) return message.channel.send({content:"Das giveaway ist noch nicht vorbei."})
                    if(g[message.guild.id][i].members.length < 1) return message.channel.send({content:"Das giveaway hatte keine Teilnehmer."})
                    g[message.guild.id][i].ended = false;
                    g[message.guild.id][i].end = 0;
                    break;
                }
            }
        }

        if(!giveaway) return message.channel.send({content:"Das giveaway mit der id existiert nicht"})

        message.channel.send({content:"Neuer gewinner wird gezogen...."})

        fs.writeFileSync("./giveaway.json", JSON.stringify(g))
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
                                winner.push(winnerr);
                            }
                        }
                    }
                }
                
                let ch = bot.channels.cache.get(g[away][i].channel)

                if(ch){
                    if(g[away][i].members.length > 0){
                        ch.send({content:"Glückwunsch <@!"+winner.join(">, <@!")+">\n"+ (winner.length == 1 ? "du hast " : "ihr habt ") + "__**"+g[away][i].price+"**__ gewonnen!"});
                    }
                }
                g[away][i].ended = true;
                g[away][i].end = new Date().getTime();
                fs.writeFileSync("./giveaway.json", JSON.stringify(g));
            }else if(new Date().getTime() > g[away][i].end + 1000*60*60 && g[away][i].ended == true){
                g[away].splice(i,1)
                fs.writeFileSync("./giveaway.json", JSON.stringify(g));
            }
        }
    })
},1000)

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
    
    
    if(interaction.customId == "giveaway_teilnahmne"){
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

        let msg = await bot.channels.cache.get(gg.channel).messages.fetch(gg.mId)

        let embed = msg.embeds[0]
        embed.footer.text = gg.members.length+" Teilnehmer"

        msg.edit({embeds:[embed], components:msg.components})

        fs.writeFileSync("./giveaway.json", JSON.stringify(g))
    }
})

//slash commands

let hellochoice1 = new slash.slashOptionChoice()
.setName("Themiebde")
.setValue("namenummer1")
let hellochoice2 = new slash.slashOptionChoice()
.setName("DerProgrammierer05")
.setValue("namenummer2")

let helloOption = new slash.slashOption()
.setName("Name")
.setDescription("Der name.")
.setRequired(true)
.setType("string")
.setChoices([hellochoice1,hellochoice2])

new slash.guildSlashCommand(bot)
.setName("hello")
.setDescription("Hello world command.")
.setGuildID("565741372586459139")
.addOption(helloOption);

slash.onExecute(bot,(message)=>{
    if(message.content == "hello"){
        slash.reply(message,"hello "+ message.options[0].value+"!").then(msg=>{
            setTimeout(()=>{
                msg.edit("Bye!")
            },5000)
        })
    }
})


bot.on("guildMemberAdd", function(member){
    let channel = member.guild.channels.cache.find(ch => ch.name === serverstats[member.guild.id].welcomechannel);
    if(!channel || channel.name === "nochannel") return;
    channel.send({content:member.displayName + " ist dem Server beigetreten!"});

    let role = member.guild.roles.cache.find(rl=>rl.name === "test");
    if(!role) return;
    member.roles.add(role);
})

bot.on("guildMemberRemove", function(member){
    let channel = member.guild.channels.cache.find(ch => ch.name === "test");
    if(!channel) return;
    channel.send({content:member.displayName + " hat den Server verlassen!"});
})

bot.on("messageCreate",function(message){
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

bot.login(token);
