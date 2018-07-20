const { GameObject } = require('./GameObject');

class World extends GameObject{
    constructor() {
        super(null, false, "world");
        this.stats = {
            deaths: {}
        }
    }

    receiveMsg(sender, str, data) {
        super.receiveMsg(sender, str, data);
        if (str === "death") {
            // get id of fleet
            let fleetID = sender.parent.id;
            console.log(`${fleetID} lost a unit`);
            if (this.stats.deaths[fleetID] === undefined) {
                this.stats.deaths[fleetID] = 0;
            } else {
                this.stats.deaths[fleetID] += 1;
            }
        }
    }
}

module.exports = { World };