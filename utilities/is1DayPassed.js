module.exports = {
    is1DayPassed: (t) =>{
        const timestamp = t;
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - timestamp;
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
        if (timeDifference >= oneDayInMilliseconds) {
            return true;
        } else {
            return false;
        }
    }
}