module.exports = {
    covertTimestampToLocalString: (timestamp) =>{
        var date = new Date(timestamp);
        var day = date.getUTCDate();
        var month = date.toLocaleString('default', { month: 'long' });
        var year = date.getUTCFullYear();

        return {
            day,
            month,
            year
        }
    }
}