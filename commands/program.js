const fs = require('fs')
const Discord = require('discord.js')
module.exports = {
    name: 'Exercicios de Programação',
    description: 'O bot irá te dar um exercicio de programação random para te divertires :smile:',
    async execute(message, args, servers) {
        if(args[0]) {
            try {
                var programmingExercise = require(`../programmingExercises/${args[0]}.json`)
                var exercise = programmingExercise[Math.floor(Math.random() * programmingExercise.length)]
                var embedMessage = new Discord.MessageEmbed().setColor('#0099ff').setTitle(this.name).addField('Exercicio', exercise).setTimestamp().setFooter(message.author.username, message.author.avatarURL()).setThumbnail(message.author.avatarURL())
                message.channel.send(embedMessage)
            } catch {
                message.channel.send("Ocurreu um erro ao tentar executar este comando, tente novamente ou chame o Administrador").then(msg => {
                    msg.delete({ timeout: 2000});
                })
                .catch();
            }
        } else {
            var embedMessage = new Discord.MessageEmbed().setColor('#0099ff').setTitle(this.name).setDescription(this.description).addField('Ajuda', "```" + servers[message.guild.id].prefix + "program <type>```")
            var exercises = []
            fs.readdir("./programmingExercises/", (err, files) => {
                files.forEach(file => {
                    exercises.push("```" + file.replace('.json', '') + "```")
                })
                embedMessage.addField("Tipos de exercisios", exercises).setTimestamp().setFooter(message.author.username, message.author.avatarURL()).setThumbnail(message.author.avatarURL())
                message.channel.send(embedMessage)
            })
        }
    },
}