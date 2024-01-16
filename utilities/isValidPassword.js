
module.exports = {
    isValidPassword: (password) =>{
        if (password.length < 8) {
            return false;
        }
        const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)(?=.*[A-Z]).*$/;
        return regex.test(password);
    }
}