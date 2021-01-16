const fs = require('fs')
module.exports = {
    async execute(location,data) {
        fs.writeFileSync(location, JSON.stringify(data, null, 4), (err) => {
            if (err) 
                console.log(err)
        })
    }
}