const fs = require('fs')
const Discord = require('discord.js')

module.exports = {
    name: "Ajuda",
    async execute(message, args, servers) {
        var embedMessage = new Discord.MessageEmbed().setColor('#0099ff').setTitle(this.name)
        var exercises = []
        fs.readdir("./commands/", (err, files) => {
            files.forEach(file => {
                embedMessage.addField("Comando", "**" + file.replace('.js', '') + "**")
            })
            embedMessage.setTimestamp().setFooter(message.author.username, message.author.avatarURL()).setThumbnail(message.author.avatarURL())
            message.channel.send(embedMessage)
        })
    }
}