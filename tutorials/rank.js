const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);

const ranks = ["Player",0,"Premium",100,"VIP",5000, "list"];

bot.on("messageCreate", async message=>{
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
})