const { execute } = require("./play");

const ytdl = require('ytdl-core')

function fancyTimeFormat(duration)
{   
    var hrs = Math.floor(duration / 3600);
    var mins = Math.floor((duration % 3600) / 60);
    var secs = Math.floor(duration % 60);
    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

module.exports = {
    name: 'Lista de Musicas',
    description: 'Mostra a lista de musicas',
    async execute(message, args, servers) {
        var musicasString = ""
        if(servers[message.guild.id]) {
            if(servers[message.guild.id].queue) {
                message.channel.send("Obtendo a Lista de Musicas...").then(msg => {
                    msg.delete({ timeout: 10000});
                })
                .catch();
                for(var i = 0; i < 10; i++) {
                    if(servers[message.guild.id].queue[i]) {
                        var getInfo = await ytdl.getInfo(servers[message.guild.id].queue[i])
                        musicasString += "Titulo: " + "**" + getInfo.videoDetails.title + "**\n"
                        musicasString += "Tempo: " + "**" + fancyTimeFormat(getInfo.videoDetails.lengthSeconds) + "**\n"
                    }
                }
                message.channel.send(musicasString).then(msg => {
                    msg.delete({ timeout: 5000});
                })
                .catch();
            }
        }
    }
}