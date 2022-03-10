const Discord = require("discord.js");
const bot = new Discord.Client({intents:[Discord.Intents.FLAGS.GUILDS,Discord.Intents.FLAGS.GUILD_MESSAGES,Discord.Intents.FLAGS.GUILD_VOICE_STATES], "partials":["MESSAGE","CHANNEL"]});
const token =  /*abboniert mich | https://discord.gg/SxBADMC*/                                                                                                                                                                                                                                                         "NzA2NDg4OTk3MzI4ODQ2ODQ4.Xq6_Jg.VNTS3UGGE3FagJGkLYO_KSPzYww";
const tempchannels = require("./tempchannels.json");       
const fs = require("fs");                                                                                                                                                                                                 
bot.login(token);

bot.on("ready", () =>{
    console.log("ACHTUNG!!! Bot ist gestrtet!");
})

bot.on("messageCreate", async message =>{
    if(message.content.startsWith("setup")){
        
        if(!message.member.voice.channel) return message.channel.send({content:"Du musst in dem Kanal sein, wo man später die kanäle erstellen kann"})
        
        let kategorie = message.guild.channels.cache.get(message.member.voice.channel.parentId)

        if(!kategorie) return message.channel.send({content:"Der kanal muss in einer Kategorie sein"});

        if(!tempchannels[kategorie.id]) tempchannels[kategorie.id] = {};
        
        tempchannels[kategorie.id] = {"createChannel":message.member.voice.channelId,"userChannels":[]};

        message.channel.send("Erfolgreich gesetupped.");

        fs.writeFileSync("./tempchannels.json",JSON.stringify(tempchannels));
    }
})

bot.on("voiceStateUpdate",(old,new_)=>{
    let createChannelOld = tempchannels[old?.channel?.parentId]?.createChannel;
    let createChannelNew = tempchannels[new_?.channel?.parentId]?.createChannel;
    
    if(old?.channelId != createChannelOld &&
        tempchannels[old?.channel?.parentId]?.userChannels.includes(old?.channelId)){//delete
        if(old.channel.members.size <= 0){
            for(i=0;i<tempchannels[old.channel.parentId].userChannels.length;i++){
                if(tempchannels[old.channel.parentId].userChannels[i] == old.channelId){
                    tempchannels[old.channel.parentId].userChannels.splice(i,1);
                    old.channel.delete().catch(err=>{});
                }
            }
            fs.writeFileSync("./tempchannels.json",JSON.stringify(tempchannels));
        }
    }

    if(new_.channelId == createChannelNew && createChannelNew!=null){//create
        new_.guild.channels.create("channel-"+new_.member.user.username,{
            type:"GUILD_VOICE",
            parent:new_?.channel?.parentId,
        }).then(c=>{
            c.permissionOverwrites.edit(new_.member.id,{"MANAGE_CHANNELS":true})
            tempchannels[new_.channel.parentId].userChannels.push(c.id);
            fs.writeFileSync("./tempchannels.json",JSON.stringify(tempchannels));
            new_.member.voice.setChannel(c).catch(err=>{});
        }).catch(err=>{})
    }
})