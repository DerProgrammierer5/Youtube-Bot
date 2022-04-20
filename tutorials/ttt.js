const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  "abboniert mich | https://discord.gg/SxBADMC"
bot.login(token);

const ttt = require("discord-tictactoe")
const game = new ttt({language:"de"})

bot.on("ready", async () =>{
    console.log("ACHTUNG!!! Bot ist gestrtet!");
})

bot.on("messageCreate",async message=>{
    if(message.content.startsWith("!ttt")){
        game.handleMessage(message);
    }
})
