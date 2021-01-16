const Discord = require('discord.js')
const fs = require('fs')
const config = require('../config.json')
module.exports = {
    name: 'Prefixo',
    description: 'Comando Prefix onde pode ver ou mudar o prefixo do bot.',
    async execute(message, args, servers) {
        if(args[0]) {
            var prevPrefix = servers[message.guild.id].prefix
            servers[message.guild.id] = {"prefix": args[0]};
            var forReturn = {"type": "write", "location": "./servers.json", "data": servers, "reload": true}
            if(servers[message.guild.id]) {
                if(servers[message.guild.id].prefix) {
                    var embedMessage = new Discord.MessageEmbed().setColor('#0099ff').setTitle(this.name).addField('Prefixo Alterado', `O prefixo mudou de **${prevPrefix}** para **${args[0]}**`).setTimestamp().setFooter(message.author.username, message.author.avatarURL()).setThumbnail(message.author.avatarURL())
                    forReturn["message"] = embedMessage
                }
            }
            return forReturn
                
        } else {
            if(servers[message.guild.id]) {
                var embedMessage = new Discord.MessageEmbed().setColor('#0099ff').setTitle(this.name).addField('Prefixo', `O seu prefixo é: **${servers[message.guild.id].prefix}**`).setTimestamp().setFooter(message.author.username, message.author.avatarURL()).setThumbnail(message.author.avatarURL())
                message.channel.send(embedMessage).then(msg => {
                    msg.delete({ timeout: 2000});
                })
                .catch();
            }
            else {
                var embedMessage = new Discord.MessageEmbed().setColor('#0099ff').setTitle(this.name).addField('Prefixo', `O seu prefixo é: **${config.defaultPrefix}**`).setTimestamp().setFooter(message.author.username, message.author.avatarURL()).setThumbnail(message.author.avatarURL())
                message.channel.send(embedMessage).then(msg => {
                    msg.delete({ timeout: 2000});
                })
                .catch();
            }
        }
    },
    default(guild, servers) {
        servers[guild.id] = {"prefix": config.defaultPrefix};
        return servers
    }
}