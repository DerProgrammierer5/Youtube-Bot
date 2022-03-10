const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
const coinfile = require("pfad zur datei");
bot.login(token);

bot.on("messageCreate", async message=>{

    if(!coinfile[message.author.id]){
        coinfile[message.author.id] = {
            coins: 100
        }
    }

    fs.writeFile("pfad zur datei", JSON.stringify(coinfile), err =>{
        if(err){
            console.log(err);
        }
    })

    //get coins
    if(message.content === "!coins"){
        let embed = new Discord.MessageEmbed()
        .setTitle("Coins von " + message.author.username)
        .setDescription("Deine Coins: " + coinfile[message.author.id].coins)
        .setColor("YELLOW")

        message.channel.send({embeds:[embed]});
    }

    //flip game
    if(message.content.startsWith("!flip")){

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

        fs.writeFile("pfad zur datei", JSON.stringify(coinfile), err =>{
            if(err){
                console.log(err);
            }
        })

    }
})