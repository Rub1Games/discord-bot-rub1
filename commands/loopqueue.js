const { execute } = require("../save");


const save = require('../save.js')

module.exports = {
    async execute(message, args, servers) {
        if(servers[message.guild.id] != undefined) {
            if(servers[message.guild.id].loopqueue == true) {
                servers[message.guild.id].loopqueue = false
            } else {
                servers[message.guild.id].loopqueue = true
            }
        } else {
            servers[message.guild.id] = {"loopqueue": true}
        }
        message.channel.send("O ciclo de musicas está com o valor: " + servers[message.guild.id].loopqueue)
        console.log(servers[message.guild.id].loopqueue)
        save.execute("./servers.json", servers)
    }
}