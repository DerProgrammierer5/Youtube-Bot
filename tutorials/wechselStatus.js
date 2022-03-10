const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);

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