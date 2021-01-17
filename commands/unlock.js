const fs = require('fs')

module.exports = {
    name: 'Prende comandos a certos canais de texto',
    async execute(message, args, servers) {
        if(servers[message.guild.id] == undefined) {
            servers[message.guild.id] = {"lockedCommands": []}
        }
        if(args[0] && message.member.permissions.has('MANAGE_MESSAGES')) {
            if(servers[message.guild.id].lockedCommands) {
                servers[message.guild.id].lockedCommands.shift(args[0])
                message.channel.send("Comando Desbloquedo!").then(msg => {
                    msg.delete({ timeout: 2000});
                })
                .catch();
            }
            var forReturn = {"type": "write", "location": "./servers.json", "data": servers, "reload": true}
            return forReturn
        }
    }
}