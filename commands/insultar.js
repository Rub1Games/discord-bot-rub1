const Discord = require('discord.js')
const Insultos = require('../insultos.json')
const save = require('../save.js')
module.exports = {
    name: 'Insultar',
    description: 'O bot irá Insultar um utilizador!',
    async execute(message, args, servers) {
        if(args[0] != undefined) {
            if(args[0].startsWith('<@!')) {
                let randomNumber = Math.floor(Math.random() * Insultos.length)
                let Insulto = Insultos[randomNumber].replace('?', args[0])
                message.channel.send(Insulto)
            }
            else {
                let phrase = []
                let User = undefined
                for(let i = 0; i < args.length; i++) {
                    if(args[i] == '' || args[i] == ' ')
                        continue
                    else {
                        if(args[i].startsWith('<@!')) {
                            User = args[i]
                            phrase.push('?')
                        }
                        else
                            phrase.push(args[i].trim());
                    }
                }
                phrase = phrase.join(' ')
                for(let i = 0; i < Insultos.length; i++) {
                    if(Insultos[i] == phrase) {
                        let Insulto = Insultos[i].replace('?', args[0])
                        message.channel.send(Insulto)
                        return;
                    }
                }
                Insultos.push(phrase)
                save.execute('insultos.json', Insultos)
                Insulto = phrase.replace('?', User)
                message.channel.send(Insulto)
            }
        }
    }
}