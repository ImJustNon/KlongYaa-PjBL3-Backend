const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    encryptPassword: async(rawPass) =>{
        return await bcrypt.genSalt(saltRounds).then(salt => bcrypt.hash(rawPass, salt));
    }
}