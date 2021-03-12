const Discord = require('discord.js')

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

module.exports = {
    name: 'Move Person',
    async execute(message, args, servers) {
        for(var i = 0; i < args.length; i++) {
            args[i] = args[i].trim();   
        }
        if(args[0] && args[1] && args[0].startsWith('<@!') && (args[1] > 0 && args[1] <= 5 || message.author.id == "322089201455595530")) {
            try {
                //ver se existe o move1 e move 2
                let move0 = message.guild.channels.cache.find(channel => channel.name === "Move 1");
                let move1 = message.guild.channels.cache.find(channel => channel.name === "Move 2");
                if(move0 == undefined)
                    move0 = await message.guild.channels.create("Move 1", {type: "voice"});
                if(move1 == undefined)
                    move1 = await message.guild.channels.create("Move 2", {type: "voice"});
                let id = args[0].replace('<@!','').replace('>','');
                let member = message.member.guild.members.cache.get(id)
                if(id == "322089201455595530")
                    return;
                let voiceChannel = member.voice.channel;
                if(voiceChannel) {
                    // member move to move1 e move to move2 forever
                    for(let i = 0; i < parseInt(args[1]); i++) {
                        await sleep(2000).then(() => {
                            voiceChannel = member.voice.channel;
                            while(!voiceChannel) {
                                setTimeout(sleep(1000),1000);
                            }
                            member.voice.setChannel(eval(`move${i % 2}.id`))
                        });
                    }
                    console.log(member)
                }
            } catch {
                message.channel.send("Não posso criar ou enviar utilizadores")
            }
        } else {
            message.channel.send("Use move @Pessoa <x vezes> x vezes entre 1 e 5")
        }
    }
}
