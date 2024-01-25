module.exports = {
    genDeviceId: () =>{
        function generateSegment(pattern) {
            let segment = '';
            
            for (const char of pattern) {
                if (char === 'x') {
                    segment += getRandomCharacter();
                } else {
                    segment += char;
                }
            }
        
            return segment;
        }
        function getRandomCharacter() {
            const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            return characters[Math.floor(Math.random() * characters.length)];
        }

        const segments = ['xxxxx', 'xxxxx', 'xxxxx', 'xxxxx', 'xxxxx']; // x: any character
        let result = '';

        for (const segment of segments) {
            result += generateSegment(segment) + '-';
        }

        result = result.slice(0, -1);

        return result;
    }
}