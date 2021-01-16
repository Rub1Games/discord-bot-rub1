const Discord = require('discord.js')
const config = require('./config.json')
let servers = require('./servers.json')
const fs = require('fs')
const client = new Discord.Client()

var prefix = config.defaultPrefix

client.on("ready", () => {
    console.log(`Discord Bot Ready, running on ${client.guilds.cache.size} Server(s)`)
    client.user.setActivity(`${client.guilds.cache.size} Server(s)`)
})

client.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name);
    client.user.setActivity(`${client.guilds.cache.size} Server(s)`)
    var startDefaultServerPrefix = require('./commands/prefix').default(guild)
    fs.writeFileSync("./servers.json", JSON.stringify(startDefaultServerPrefix, null, 4), (err) => {
        if (err) 
            console.log(err)
    })
    delete require.cache[require.resolve("./servers.json")];
    servers = require("./servers.json");
})

client.on("messageReactionAdd", (reaction, user) => {
    if(user.bot) return;
    if(reaction.message.embeds[0].fields[0].name == "Pergunta") {
        let cmd = require('./commands/quiz.js')
        fs.readdir("./quizQuestions/", (err, files) => {
            files.forEach(file => {
                let jsonFile = require(`./quizQuestions/${file}`)
                jsonFile.forEach(line => {
                    if(line.text == reaction.message.embeds[0].fields[0].value) {
                        if(reaction.emoji.name != line.answer) {
                            reaction.message.channel.send(`<@${user.id}> você obteu: ❌`).then(msg => {
                                msg.delete({ timeout: 2000});
                            })
                            .catch();
                        } else {
                            reaction.message.channel.send(`<@${user.id}> você obteu: :white_check_mark:`).then(msg => {
                                msg.delete({ timeout: 2000});
                            })
                            .catch();
                        }
                    }
                })
                if(servers[reaction.message.guild.id]) {
                    if(servers[reaction.message.guild.id].quiz) {
                        if(servers[reaction.message.guild.id].quiz.playing && file.replace('.json', '') == servers[reaction.message.guild.id].quiz.name) {
                            cmd.getQuiz(reaction.message, file.replace('.json', ''))
                        }
                    }
                }
            })  
        })
    }
})

client.on("guildDelete", guild => {
    console.log("Left a guild: " + guild.name);
    client.user.setActivity(`${client.guilds.cache.size} Server(s)`)
})

client.on("message", async (message) => {
    let enter = true
    if(servers[message.guild.id]) {
        prefix = servers[message.guild.id].prefix
    }
    var args = message.content.slice(prefix.length).split(' ')
    if(message.content.startsWith(prefix)) {
        if(servers[message.guild.id]) {
            if(servers[message.guild.id].lockedCommands) {
                servers[message.guild.id].lockedCommands.forEach(cmd => {
                    if(cmd.name == args[0]) {
                        if(cmd.permitedChannel != message.channel.id || cmd.permitedChannel == undefined) {
                            enter = false
                            if(cmd.permitedChannel)
                                message.channel.send("Não podes usar esse comando aqui, usa em: ```#" + message.guild.channels.cache.get(cmd.permitedChannel).name + "```").then(msg => {
                                    msg.delete({ timeout: 2000});
                                })
                                .catch();
                            else
                                message.channel.send("Não podes usar esse comando neste servidor").then(msg => {
                                    msg.delete({ timeout: 2000});
                                })
                                .catch();
                        }                 
                    }
                })
            }
        }
        try {
            if(enter) {
                var commandRequire = require(`./commands/${args[0]}.js`)
                var response = await commandRequire.execute(message, args.slice(1), servers)
                if(response != undefined) {
                    if(response.type == "write") {
                        require('./save.js').execute(response.location, response.data)
                        if(response.message != undefined)
                            message.channel.send(response.message).then(msg => {
                                msg.delete({ timeout: 10000});
                            })
                            .catch();
                    }
                    if(response.reload == true) {
                        delete require.cache[require.resolve(response.location)]
                        servers = require(response.location);
                    }
                }
            }
        }
        catch {
            message.channel.send("Ocurreu um erro ao tentar executar o comando, tente usar o comando 'help'!").then(msg => {
                msg.delete({ timeout: 10000});
            })
            .catch();
        }
        
    }
})

client.login(process.env.TOKEN)