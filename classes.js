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
        if (this.hp <= 0) {
            this.squad.removeUnit(this);
            // log(this, 'died');
        }
    }
    targetRandom(squad) {
        if (squad.units.length > 0) {
            return utils.pickFrom(squad.units);
        }
    }
    targetMostWounded(squad) {
        if (squad.units.length > 0) {
            return squad.units.sort(unit => unit.hp)[0];
        }
    }
    targetHealthiest(squad) {
        if (squad.units.length > 0) {
            return squad.units.sort(unit => unit.hp).reverse()[0];
        }
    }
    attack(target) {
        if (target === undefined) return;
        // log(this, 'attacking', target);
        target.receiveDamage(this.dmg);
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

let ship = new Unit(3, 3);
let wins = {0: 0, 1: 0};
for (let iter=0; iter<100; iter++) {
    let squads = [];
    squads.push(new Squad(), new Squad());
    // let stat = (i) => utils.randomInt(1, i);
    let hpI = (i) => i;
    let atkI = (i) => Math.floor(i/4);
    for (let i=1; i<20; i++) {
        if (i > 4)
            squads[0].addUnit(new Unit(hpI(i), atkI(i)));
        squads[1].addUnit(new Unit(hpI(i), atkI(i)));
    }
    // log(ship);
    ship.attack(ship.targetHealthiest(squads[0]));
    
    while (squads[0].units.length > 0 && squads[1].units.length > 0) {
        // 0 turn
        if (squads[0].units.length > 0) {
            for (ship of squads[0].units) {
                ship.attack(ship.targetRandom(squads[1]));
                ship.attack(ship.targetHealthiest(squads[0]));
            }
        }
        // 1 turn
        if (squads[1].units.length > 0) {
            for (ship of squads[1].units) {
                // ship.attack(ship.targetRandom(squads[0]));
                ship.attack(ship.targetMostWounded(squads[0]));
            }
        }
    }
    if (squads[0].units.length === 0) {
        wins[1] += 1;
    } else {
        wins[0] += 1;
    }
}
console.log(wins);