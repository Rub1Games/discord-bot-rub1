const { execute } = require("../save");


const save = require('../save.js')

module.exports = {
    async execute(message, args, servers) {
        if(servers[message.guild.id]) {
            if(servers[message.guild.id].loopqueue == true) {
                servers[message.guild.id].loopqueue = false
            } else {
                servers[message.guild.id].loopqueue = true
            }
        }
        console.log(servers[message.guild.id].loopqueue)
        save.execute("./servers.json", servers)
    }
}