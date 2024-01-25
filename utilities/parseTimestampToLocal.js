module.exports = {
    parseTimestampToLocal: (t) =>{
        const timestampMilliseconds = t;
        const timestamp = new Date(timestampMilliseconds);
        const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const localFormatter = new Intl.DateTimeFormat('en-US', { timeZone: localTimeZone });
        const localFormatted = localFormatter.format(timestamp);
        return {
            localTimeZone,
            localFormatted
        }
    }
}