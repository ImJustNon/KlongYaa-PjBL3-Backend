const tokenLength = 64;
const crypto = require('crypto');

module.exports = {
    genToken: () => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(tokenLength, async(error, buffer) =>{
                if(error){
                    console.log(error);
                }
                resolve(buffer.toString('hex'));
            });
        });
    }
}