const bcrypt = require('bcrypt');

module.exports = {
    comparePassword: async(rawPass, hashPass) =>{
        return await bcrypt.compare(rawPass, hashPass);
    }
}