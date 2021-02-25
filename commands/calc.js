const Discord = require('discord.js')

function getArrayBits(ip, number_bar) {
    var Octetos = [[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]]
    var cnt = 0
    for(let i = 0; i < Octetos.length; i++) {
        for(let i2 = 0; i2 < number_bar; i2++) {
            Octetos[cnt][i2] = 1;
            if(Octetos[cnt][7] == 1) {
                cnt++;
                break;
            }
        }
        number_bar -= 8;
    }
    return Octetos;
}

function getNumberofEndereços(arr_bits) {
    var cnt = 0
    for(let i = 0; i < arr_bits.length; i++) {
        for(let i2 = 0; i2 < 8; i2++) {
            if(arr_bits[i][i2] == 0) {
                cnt++;
            }
        }
    }
    return cnt;
}

function getNumberofSubRedes(arr_bits) {
    cnt = 0;
    for(let i = 0; i < arr_bits.length; i++) {
        if(arr_bits[i][7] == 0) {
            for(let i2 = 0; i2 < 8; i2++) {
                if(arr_bits[i][i2] == 1) {
                    cnt++;
                }
            }
        }
    }
    return cnt;
}

function getPeso(arr_bits) {
    var pesos = []
    for(let i = 0; i < arr_bits.length; i++) {
        var peso = 128
        var soma_peso = 0;
        for(let i2 = 0; i2 < 8; i2++) {
            soma_peso += arr_bits[i][i2] * peso
            peso /= 2;
        }
        pesos.push(soma_peso)
    }
    return pesos
}

function getAllIps(arr_bits) {
    let numberSubRedes = 2 ** getNumberofSubRedes(arr_bits)
    let end = 256 / numberSubRedes
    let range = []
    let start = 0;
    while(end < 256) {
        range.push({"start": start, "end": end - 1})
        start = end
        end += end;
    }
    range.push({"start": start, "end": end - 1})
    start = end
    end += end;
    console.log(range)
}


module.exports = {
    execute(message, args, servers) {
        if(args[0] != undefined) {
            if(args[0].includes('/')) {
                let arr_bits = getArrayBits(args[0].split('/')[0], args[0].split('/')[1])
                let Pesos = getPeso(arr_bits)
                let msg = "";
                for(let i = 0; i < arr_bits.length; i++) {
                     msg += `**Octeto ${i}**: ${arr_bits[i].join(' - ')} -> Peso: ${Pesos[i]}\n`
                }
                var allIps = getAllIps(arr_bits)
                msg += "**Mascara de SubRede**: " + Pesos.join('.') + "\n"
                msg += "**Número de endereços**: 2^" + getNumberofEndereços(arr_bits) + " = " + 2 ** getNumberofEndereços(arr_bits) + "\n"
                msg += "**Número de subredes**: 2^" + getNumberofSubRedes(arr_bits) + " = " + 2 ** getNumberofSubRedes(arr_bits) + "\n"
                msg += "**Número de Hosts Válidos**: **<Número de endereços>** - 2 = " + (2 ** getNumberofEndereços(arr_bits) - 2) + "\n"
                message.channel.send(msg)
            } else {
                console.log("Não Contem Barra")
            }
        }
    }
}