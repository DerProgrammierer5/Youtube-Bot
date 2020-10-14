const Discord = require("discord.js");
const bot = new Discord.Client();
const token =  /*weg xd*/
const fs = require("fs");
const coinfile = require("./coins.json");
const xpfile = require("./xp.json")
const serverstats = require("./servers.json");
const ascii = require("ascii-art");

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

bot.on("message", async message =>{

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
        }
    }

    fs.writeFile("./servers.json", JSON.stringify(serverstats), err =>{
        if(err){
            console.log(err);
        }
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

        message.channel.send(embed);
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

        if(isNaN(bounty)) return message.reply("Du hast keine Zahl für Coins angegeben. Du hast **"+ bounty+"** angegeben.")

        if(!bounty) return message.reply("Du hast keine Coins angegeben.");

        if(!val) return message.reply("Du hast kein Kopf oder zahl angegeben.");

        if(coinfile[message.author.id].coins < bounty) return message.reply("Du hast zu wenig Coins!");

        coinfile[message.author.id].coins -= bounty;

        coinfile[message.author.id].coins = Number(coinfile[message.author.id].coins)

        let chance = Math.floor(Math.random() * 2);

        if(chance == 0){
            if(val.toLowerCase() == "kopf"){
                message.reply("Und es ist... **Kopf**! Dein Einsatz verdoppelt sich.");

                bounty = bounty *2

                coinfile[message.author.id].coins += bounty;

                coinfile[message.author.id].coins = Number(coinfile[message.author.id].coins)

            }else{

                if(val.toLowerCase() == "zahl"){
                    message.reply("Und es ist... **Kopf**! Du hast verloren.")
                }else{
                    coinfile[message.author.id].coins += bounty

                    coinfile[message.author.id].coins = Number(coinfile[message.author.id].coins)
                    message.reply("Du hast **Kopf** oder **Zahl** falsch geschrieben oder an die falsche Stelle gesetzt.")
                }

            }
        }else{

            if(val.toLowerCase() == "zahl"){
                message.reply("Und es ist... **Zahl**! Dein Einsatz verdoppelt sich.");

                bounty = bounty *2

                coinfile[message.author.id].coins += bounty;

                coinfile[message.author.id].coins = Number(coinfile[message.author.id].coins)

            }else{

                if(val.toLowerCase() == "kopf"){
                    message.reply("Und es ist... **Zahl**! Du hast verloren.")
                }else{
                    coinfile[message.author.id].coins += bounty

                    coinfile[message.author.id].coins = Number(coinfile[message.author.id].coins)

                    message.reply("Du hast **Kopf** oder **Zahl** falsch geschrieben oder an die falsche Stelle gesetzt.")
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

        message.channel.send(embed);
    }

    if(message.content.startsWith("!clear")){
        let messages = message.content.split(" ").slice(1).join("");

        if(isNaN(messages)) return message.reply("Du hast keine Zahl angegeben, sonder Buchstaben.").then(msg=>msg.delete({timeout:"5000"}));
        
        message.channel.bulkDelete(messages);

        message.channel.send("Habe " + messages + " Nachrichten gelöscht.").then(msg=>msg.delete({timeout:"5000"}));
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

        message.channel.send(embed);
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

        message.channel.send(embed);
    }

    if(message.content === "!ping"){
        message.channel.send("Pong! :ping_pong: Dauerte "+bot.ws.ping+"ms");
    }

    if(message.content.startsWith("!react")){

        let text = message.content.split(" ").slice(1).join(" ");

        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Du hast keine Rechte dafür!");

        message.channel.send(text).then(msg=>{
            msg.react('👍');
        })
    }

    if(message.content.startsWith("!kick")){
        message.delete()
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Du hast keine Rechte dafür!").then(msg=>msg.delete({timeout:"5000"}));

        let user = message.mentions.members.first();

        if(!user) return message.reply("Du hast vergessen einen Nutzer anzugeben!").then(msg=>msg.delete({timeout:"5000"}));

        message.guild.member(user).kick().catch(err=>{
            if(err){
                message.channel.send("Konnte den Nutzer nicht kicken: "+err).then(msg=>msg.delete({timeout:"10000"}));
            }else{
                message.channel.send("Erfolgreich den Nutzer gekickt!").then(msg=>msg.delete({timeout:"5000"}));
            }
        })
    }

    if(message.content.startsWith("!ban")){
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("Du hast keine Rechte dafür!").then(msg=>msg.delete({timeout:"5000"}));

        let user = message.mentions.members.first();

        if(!user) return message.reply("Du hast vergessen einen Nutzer anzugeben!")

        message.guild.member(user).ban().catch(err=>{
            if(err){
                message.channel.send("Konnte den Nutzer nicht bannen: "+err).then(msg=>msg.delete({timeout:"10000"}));
            }else{
                message.channel.send("Erfolgreich den Nutzer gebannt!").then(msg=>msg.delete({timeout:"5000"}));
            }
        })
    }

    //rang system

    if(message.content.startsWith("!buyrank")){
        let rank;
        let mrank = message.content.split(" ").slice(1).join(" ");
        if(!mrank) return message.reply("Du hast keinen Rang zum kaufen angegeben.").then(msg=>msg.delete({timeout:"5000"}));

        for(var i=0;i<ranks.length;i++){
            if(isNaN(ranks[i])){
                if(mrank.toLowerCase() == ranks[i].toLowerCase()){
                    rank = ranks[i];
                    break;
                }
            }
        }

        if(!rank){
            return message.reply("Dieser Rang existiert nicht. Bekomme eine Liste mit den Rängen mit !buyrank list").then(msg=>msg.delete({timeout:"5000"}));
        }else{

            for(var i=0;i<ranks.length;i++){
                if(isNaN(ranks[i]) && ranks[i] !== "list"){
                    if(rank == ranks[i]){
                        if(coinfile[message.author.id].coins < ranks[i+1]){
                            return message.reply("Du hast zu wenig Geld dafür!").then(msg=>msg.delete({timeout:"5000"}));
                        }

                        let name = message.member.nickname || message.author.username;

                        if(name.includes(ranks[i].toUpperCase())){
                            message.reply("Du hast diesen Rang bereits!").then(msg=>msg.delete({timeout:"5000"}));
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
                            message.channel.send(`Erfolgreich den rang ${rank} gekauft!`).then(msg=>msg.delete({timeout:"5000"}));
                        }).catch(err=>{
                            if(err){
                                message.channel.send("Konnte den Rang nicht hinzufügen: "+err)
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

                message.channel.send(embed)
            }
        }

        fs.writeFile("./coins.json",JSON.stringify(coinfile),function(err){
            if(err) console.log(err)
        })

    }

    //prefix änderer

    if(message.content === "prefix"){
        message.channel.send("Die Prefix ist **"+serverstats[message.guild.id].prefix+"**");
    }

    if(message.content.startsWith(prefix+"setprefix")){
        let newprefix = message.content.split(" ").slice(1).join("");

        if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Du hast keine Rechte!");

        serverstats[message.guild.id].prefix = newprefix;

        message.channel.send("Die neue Prefix ist **"+newprefix+"**.");

        fs.writeFile("./servers.json",JSON.stringify(serverstats),function(err){
            if(err) console.log(err);
        })
    }


    //global chat

        if(message.channel.name == "global" && !message.author.bot){
            bot.guilds.cache.forEach(guild=>{
                if(guild == message.guild) return;
                let channel = guild.channels.cache.find(ch=>ch.name === "global");
                if(!channel) return;
                let embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag +" | Global Chat")
                .setColor("RANDOM")
                .setDescription(message.content)
                .setFooter("Server: "+message.guild.name)
                .setTimestamp()
                channel.send(embed)
            })
        }

    //message abwarten

    if(message.content === "!widerhole"){
        message.reply("Sage was ich sagen soll, du hast 30 Sekunden!");

        const filter = m => m.author.id === message.author.id;

        message.channel.awaitMessages(filter, {max:1,time:5*1000}).then(collections=>{
            let gesmessage = collections.first().content;

            if(gesmessage === "cancel") return message.channel.send("Erfolgreich abgebrochen!").then(msg=>msg.delete({timeout:"5000"}));

            message.channel.send("Du sagtest: "+gesmessage);
        }).catch(err=>{
            if(err) return message.reply("Die zeit ist abgelaufen!").then(msg=>msg.delete({timeout:"5000"}));
        })
    }

    //ascii

    if(message.content.startsWith(prefix+"ascii")){
        let content = message.content.split(" ").slice(1).join(" ");

        if(!content) return message.reply("Du hast vergessen anzugeben was ich schreiben soll.").then(msg=>msg.delete({timeout:"5000"}));

        ascii.font(content,"Doom",function(err,result){
            if(err){
                return message.channel.send("Error: "+err);
            }
            message.channel.send(result,{ 
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

        if(message.channel.name !== "ticket") return message.reply("Du kannst in diesem Kanal kein ticket erstellen!").then(msg=>msg.delete({timeout:"5000"}));

        message.delete();

        let category = message.guild.channels.cache.find(ct=>ct.name === "tickets" && ct.type === "category");

        if(!category) await message.guild.channels.create("tickets", {type:"category"}).then(cat=>category = cat);

        if(message.guild.channels.cache.find(cha=>cha.name===`ticket-${username.toLowerCase()}`)) return message.reply("Du hast bereits ein ticket erstellt!").then(msg=>msg.delete({timeout:"5000"}));

        let supporterRole = message.guild.roles.cache.find(rl=>rl.name ==="Supporter");

        if(!supporterRole) return message.reply("Ich konnte keine Supporter rolle finden!").then(msg=>msg.delete({timeout:"5000"}));

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

            ch.send(`Hey <@&${supporterRole.id}>, hier braucht jemand hilfe!`);
        }).catch(err=>{
            if(err) return message.channel.send("Ein fehler ist aufgetreten: "+err);
        })

        message.reply("Ein ticket wurde erstellt. Bitte begebe dich in diesem text kanal und beschreibe dein problem").then(msg=>msg.delete({timeout:"9000"}));
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

        if(message.channel.name !== `ticket-${username.toLowerCase()}` && !message.member.roles.cache.find(rl=>rl.name==="Supporter")) return message.reply("Dies ist nicht dein ticket. Du kannst es also auch nicht beenden.").then(msg=>msg.delete({timeout:"5000"}));

        await message.channel.send("Ticket wird geschlossen...");

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

        if(!newchannel) return message.reply("Du hast keinen Kanal angegeben!").then(msg=>msg.delete({timeout:"5000"}));
    
        serverstats[message.guild.id].welcomechannel = newchannel.name;

        message.channel.send("Der welcome channel ist nun "+newchannel.name)/*.then(msg=>msg.delete({timeout:"5000"}));*/

        fs.writeFile("./servers.json", JSON.stringify(serverstats), function(err){
            if(err) console.log(err);
        })
    }

})

bot.on("guildMemberAdd", function(member){
    let channel = member.guild.channels.cache.find(ch => ch.name === serverstats[member.guild.id].welcomechannel);
    if(!channel || channel.name === "nochannel") return;
    channel.send(member.displayName + " ist dem Server beigetreten!");

    let role = member.guild.roles.cache.find(rl=>rl.name === "test");
    if(!role) return;
    member.roles.add(role);
})

bot.on("guildMemberRemove", function(member){
    let channel = member.guild.channels.cache.find(ch => ch.name === "test");
    if(!channel) return;
    channel.send(member.displayName + " hat den Server verlassen!");
})

bot.on("message",function(message){
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

        message.reply("ist nun Level **"+xpfile[message.author.id].level+"**!").then(
            msg=>msg.delete({timeout:"10000"})
        )
    }

    fs.writeFile("./xp.json",JSON.stringify(xpfile),function(err){
        if(err) console.log(err)
    })

    if(message.content.startsWith("!level")){
        let user = message.mentions.users.first() || message.author

        if(user.bot) return message.reply("Bots haben kein XP!")

        let embed = new Discord.MessageEmbed()
        .setTitle("Level Karte")
        .setColor("GREEN")
        .addField("Level: ",xpfile[user.id].level)
        .addField("XP: ", xpfile[user.id].xp+"/"+xpfile[user.id].reqxp)
        .addField("Xp bis zum nächsten Level: ",xpfile[user.id].reqxp)
        message.channel.send(embed)
    }
})

bot.login(token);
