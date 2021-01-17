const fs = require('fs')
const Discord = require('discord.js')
const save = require('../save.js')

module.exports = {
    name: 'Quiz',
    description: 'O bot irá te dar um quiz para te divertires :smile:',
    async getQuiz(message, args) {
        if(args.isArray) {
            var quizQuestions = require(`../quizQuestions/${args[0]}.json`)
        } else {
            var quizQuestions = require(`../quizQuestions/${args}.json`)
        }
        var question = quizQuestions[Math.floor(Math.random() * quizQuestions.length)]
        var embedMessage = new Discord.MessageEmbed().addField("Pergunta",question.text).setColor('#0099ff').setTitle(this.name)
        message.channel.send(embedMessage).then(msg => {
            msg.react("👍")
            msg.react("👎")
        })
    },
    async execute(message, args, servers) {
        if(args[0] && args[1]) {
            try {
                if(args[1] == "start") {
                    if(servers[message.guild.id] == undefined) {
                        servers[message.guild.id] = {"quiz": {}}
                    }
                    servers[message.guild.id].quiz = {"playing": true, "name": args[0]}
                    message.channel.send("Você começou o quiz!").then(msg => {
                        msg.delete({ timeout: 2000});
                    })
                    .catch();
                }
            }
            catch {
                message.channel.send("Ocurreu um erro ao tentar executar este comando, tente novamente ou chame o Administrador").then(msg => {
                    msg.delete({ timeout: 2000});
                })
                .catch();
            }
        } else {
            if(args[0]) {
                if(args[0] == "stop") {
                    message.channel.send("Você parou o quiz!").then(msg => {
                        msg.delete({ timeout: 2000});
                    })
                    .catch();
                    servers[message.guild.id].quiz = undefined
                }
                else {
                    try {
                        this.getQuiz(message, args[0])
                    } catch {
                        message.channel.send("Ocurreu um erro ao tentar executar este comando, tente novamente ou chame o Administrador").then(msg => {
                            msg.delete({ timeout: 2000});
                        })
                        .catch();
                    }
                } 
            } else {
                var embedMessage = new Discord.MessageEmbed().setColor('#0099ff').setTitle(this.name).setDescription(this.description).addField('Ajuda', "```" + servers[message.guild.id].prefix + "quiz <type>```")
                var quizQuestions = []
                fs.readdir("./quizQuestions/", (err, files) => {
                    files.forEach(file => {
                        quizQuestions.push("```" + file.replace('.json', '') + "```")
                    })
                    embedMessage.addField("Tipos de quiz", quizQuestions).setTimestamp().setFooter(message.author.username, message.author.avatarURL()).setThumbnail(message.author.avatarURL())
                    message.channel.send(embedMessage)
                })
            }
        }
        save.execute("./servers.json", servers)
        if(servers[message.guild.id] != undefined) {
            if(servers[message.guild.id].quiz != undefined) {
                try {
                    this.getQuiz(message, servers[message.guild.id].quiz.name)
                } catch {
                    servers[message.guild.id].quiz = undefined
                    message.channel.send("Ocurreu um erro ao tentar executar este comando, tente novamente ou chame o Administrador").then(msg => {
                        msg.delete({ timeout: 2000});
                    })
                    .catch();
                }
            }
        }
    }
}