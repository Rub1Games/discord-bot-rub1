const ytdl = require('ytdl-core');
const Discord = require('discord.js')
const search = require('youtube-search')
const ytpl = require('ytpl')

let playing = false

var opts = {
    maxResults: 1,
    key: 'AIzaSyA5EfCQ76Zd5IC6qLJYXlrZLbvit5DXb7k'
}

var embedMessage = new Discord.MessageEmbed()

module.exports = {
    name: 'Musica',
    description: 'O bot irá tocar uma musica do youtube ou uma playlist!',
    async execute(message, args, servers) {
        if(args.length > 0) {
            args = args.join(' ')
            embedMessage.setColor('#0099ff').setTitle(this.name).setDescription(this.description).setTimestamp().setFooter(message.author.username, message.author.avatarURL())
            const voiceChannel = message.member.voice.channel;
            if (!voiceChannel) {
                return message.reply('please join a voice channel first!');
            }
            let returnIndex = await voiceChannel.join().then(async connection => {
                message.channel.send("Pesquisando...")
                if(args.startsWith("http") == false) {
                    let forReturn = await search(args.join(" "), opts, async function(err, results) {
                        embedMessage.addFields({name:'Titulo', value: results[0].title}, {name: 'Canal', value: results[0].channelTitle}).setThumbnail(results[0].thumbnails.high.url)
                        message.channel.send(embedMessage)
                        await play(connection, results[0].link, message, servers, false)
                    })
                } else {
                    let forReturn = await playPlaylist(connection, args, message, servers)
                    return forReturn
                }
            })
            return returnIndex
        } else {
            if(servers[message.guild.id].queue) {
                if(servers[message.guild.id].queue.length > 0) {
                    const voiceChannel = message.member.voice.channel
                    voiceChannel.join().then(async connection => {
                        message.channel.send("Começando a ultima lista de músicas!")
                        let forReturn = await play(connection, servers[message.guild.id].queue.shift(), message, servers, true)
                        return forReturn
                    })
                }
            }
        }
    }
}

async function play(connection, url, message, servers, skipFile) {
    const voiceChannel = message.member.voice.channel;
    let stream = ytdl(url, { filter: 'audioonly' });
    if(skipFile == false) {
        if(servers[message.guild.id].queue == undefined)
            servers[message.guild.id].queue = [url]
        else
            servers[message.guild.id].queue.push(url)
    }
    if(playing == false) {
        playing = true
        servers[message.guild.id].nowPlaying = url
        require('../save.js').execute("./servers.json", servers)
        let dispatcher = await connection.play(stream)
        dispatcher.on("finish", async function(err) {
            playing = false
            if(servers[message.guild.id].queue != undefined) {
                if(servers[message.guild.id].queue.length > 0) {
                    var nextVideo = servers[message.guild.id].queue.shift();
                    if(servers[message.guild.id].loopqueue == true) {
                        servers[message.guild.id].queue.push(url)
                    }
                    require('../save.js').execute("./servers.json", servers)
                    await play(connection, nextVideo, message, servers, true)
                }
                else {
                    servers[message.guild.id].queue = undefined
                    require('../save.js').execute("servers.json", servers)
                    voiceChannel.leave()
                }
            } else
                voiceChannel.leave()
        })
    }
    return {"type": "write", "location": "./servers.json", "data": servers, "reload": true}
}

async function playPlaylist(connection, playListID, message, servers) {
    let stream = await ytpl(playListID, { filter: 'audioonly' });
    embedMessage.addFields({name:'Titulo da Playlist', value: stream.title}, {name: 'Canal', value: stream.author.name}, {name: 'Numero estimado de músicas', value: stream.estimatedItemCount}).setThumbnail(stream.thumbnails[0].url)
    message.channel.send(embedMessage)
    let firstVideo = stream.items.shift()
    await play(connection, firstVideo.url, message, servers, true)
    let forReturn = await Promise.all(stream.items.map(async video => {
        let valueForReturn = await play(connection, video.url, message, servers, false)
        if(valueForReturn)
            return valueForReturn
    }));
    return forReturn[stream.items.length - 1]
}

