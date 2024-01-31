module.exports = {
    convertDateObjToTimestamp: (dateObj) =>{
        const alertTime = {
            day: dateObj.day,
            month: dateObj.month,
            year: dateObj.year,
            hour: dateObj.hour,
            minute: dateObj.minute,
            ampm: dateObj.ampm
        }

        const date = new Date(`${alertTime.year}-${alertTime.month}-${alertTime.day} ${alertTime.hour}:${alertTime.minute} ${alertTime.ampm}`);
        const timestamp = date.getTime();
        return timestamp;
    }
}