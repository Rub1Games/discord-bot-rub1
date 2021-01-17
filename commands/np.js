const ytdl = require('ytdl-core')
const Discord = require('discord.js')
module.exports = {
    name: 'Now Playing',
    async execute(message, args, servers) {
        console.log(message.guild)
        var voiceChannel = message.guild.voice;
        if(voiceChannel != undefined) {
            if(servers[message.guild.id] != undefined) {
                if(servers[message.guild.id].nowPlaying) {
                    var musicasString = ""
                    var getInfo = await ytdl.getInfo(servers[message.guild.id].nowPlaying)
                    var embedMessage = new Discord.MessageEmbed().setColor('#0099ff').setTitle(this.name).addField('Agora a tocar', "**" + getInfo.videoDetails.title + "**").setThumbnail(getInfo.videoDetails.thumbnails[0].url).setFooter(message.author.username, message.author.avatarURL())
                    message.channel.send(embedMessage).then(msg => {
                        msg.delete({ timeout: 5000});
                    })
                }
            }
        } else {
            message.channel.send("O bot precisa de estar a tocar música!").then(msg => {
                msg.delete({ timeout: 10000});
            })
        }
    }
}