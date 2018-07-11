var utils = require('./cmutils.js');
var { log, addToArrUnique, removeFromArr } = utils;

class Unit {
    constructor(hp, dmg) {
        this.basehp = hp;
        this.hp = hp;
        this.basedmg = dmg;
        this.dmg = dmg;
    }
    // set squad(val) {}

    receiveDamage(dmg) {
        this.hp -= dmg;
        if (this.hp < 0) {
            this.squad.removeUnit(this);
            log(this, 'died');
        }
    }
    attackRandom(squad) {
        if (squad.units.length > 0) {
            let target = utils.pickFrom(squad.units);
            // log(target, 'received damage', this.dmg);
            target.receiveDamage(this.dmg);
        }
    }
    toString() {
        return '[' + 'o'.repeat(Math.max(this.hp, 0)) + ' ' + this.dmg + ']';
    }
}

class Squad {
    constructor() {
        this.units = [];
    }
    addUnit(unit) {
        addToArrUnique(this.units, unit);
        unit.squad = this;
    }
    removeUnit(unit) {
        removeFromArr(this.units, unit);
    }
    toString() {
        return this.units;
    }
}

let ship = new Unit(10, 5);
let squads = [];
squads.push(new Squad(), new Squad());
for (let i=0; i<5; i++) {
    squads[0].addUnit(new Unit(utils.randomInt(1, 9), utils.randomInt(1, 3)));
    squads[1].addUnit(new Unit(utils.randomInt(1, 3), utils.randomInt(1, 9)));
}
log(ship);
log(squads[0].units);
ship.attackRandom(squads[0]);
log(squads[0].units);