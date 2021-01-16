const fs = require('fs')

module.exports = {
    name: 'Desativa comandos ou define para um canal de texto',
    async execute(message, args, servers) {
        if(args[0] && args[1] && message.member.permissions.has('MANAGE_MESSAGES')) {
            if(servers[message.guild.id].lockedCommands) {
                if(servers[message.guild.id].lockedCommands[args[0]] != undefined) {
                    servers[message.guild.id].lockedCommands = {"name": args[0], "permitedChannel": args[1]}
                    message.channel.send("Comando Bloqueado!")
                } else {
                    servers[message.guild.id].lockedCommands.push({"name": args[0], "permitedChannel": args[1]})
                    message.channel.send("Comando Bloqueado!")
                }
            } else {
                servers[message.guild.id].lockedCommands = [{"name": args[0], "permitedChannel": args[1]}]
                message.channel.send("Comando Bloqueado!")
            }
            var forReturn = {"type": "write", "location": "./servers.json", "data": servers, "reload": true}
            console.log({"name": args[0], "permitedChannel": args[1]})
            return forReturn
        } else {
            if(args[0] && message.member.permissions.has('MANAGE_MESSAGES')) {
                if(servers[message.guild.id].lockedCommands) {
                    if(servers[message.guild.id].lockedCommands[args[0]] == undefined) {
                        servers[message.guild.id].lockedCommands.push({"name": args[0]})
                        message.channel.send("Comando Bloqueado!")
                    }
                } else {
                    servers[message.guild.id].lockedCommands = [{"name": args[0]}]
                    message.channel.send("Comando Bloqueado!")
                }
                var forReturn = {"type": "write", "location": "./servers.json", "data": servers, "reload": true}
                return forReturn
            }
        }
    }
}