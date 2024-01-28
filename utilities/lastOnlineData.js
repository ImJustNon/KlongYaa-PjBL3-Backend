data = [];
module.exports = class LastOnlineData {
    constructor() {}

    update(boxId){
        const checkForLastData = data.filter(data => data.boxId === boxId);
        if(checkForLastData !== 0){
            let indexToRemove = data.findIndex(data => data.boxId === boxId);
            if (indexToRemove !== -1) {
                data.splice(indexToRemove, 1);
            }
        }
    
        return data.push({
            boxId: String(boxId),
            timestamp: String(new Date().getTime())
        });
    }

    getAll(){
        return data;
    }

    get(boxId){
        return data.filter(d => d.boxId === boxId);
    }
}

