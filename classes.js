"use strict";
var utils = require('./cmutils.js');
var { log, addToArrUnique, removeFromArr } = utils;


function targetRandom(group) {
    if (group.units.length > 0) {
        return utils.pickFrom(group.units);
    }
}
function targetMostWounded(group) {
    if (group.units.length > 0) {
        let targets = group.units.slice().sort((unitA, unitB) => unitA.hp > unitB.hp);
        // log(`most wounded: ${targets}`);
        return targets[0];
        // return group.units.slice().sort(unit => unit.hp)[0];
    }
}
function targetHealthiest(group) {
    if (group.units.length > 0) {
        let targets = group.units.slice().sort((unitA, unitB) => unitA.hp < unitB.hp);
        // log(`healthiest: ${targets}`);
        return targets[0];
        // return group.units.slice().sort(unit => unit.hp)[0];
    }
}

class Script {
    constructor(unit, enemies, priority) {
        this.unit = unit;
        this.enemies = enemies;
        this.priority = priority;
    }
}

class Ability {
    constructor(name, unit) {
        this.name = name;
        this.unit = unit;
    }
    use(target) {
    }
}

class Attack extends Ability {
    constructor(unit, dmg) {
        super('attack', unit); 
        this.dmg = dmg;
    }
    use(target) {
        target && target.receiveDamage(this.dmg);
    }
}

class Heal extends Ability {
    constructor(unit, amount) {
        super('heal', unit);
        this.amount = amount;
    }
    use(target) {
        target.hp = Math.min(target.basehp, target.hp + this.amount);
    }
}

class Wait extends Ability {
    constructor(unit) {
        super('wait', unit);
    }
}

class Unit {
    constructor(hp, ap) {
        this.basehp = hp;
        this.hp = hp;
        this.baseap = ap;
        this.ap = ap;
        this.abilities = {};
    }
    // set group(val) {}
    addAbility(ability) {
        this.abilities[ability.name] = ability;
    }
    use(abilityName, ...args) {
        this.abilities[abilityName].use(...args);
    }
    receiveDamage(dmg) {
        this.hp -= dmg;
        if (this.hp <= 0) {
            this.group.removeUnit(this);
            // log(this, 'died');
        }
    }
    toString() {
        return `[${this.hp}]`;
        // return `${this.hp < this.basehp ? 'u' : 'U'}`;
    }
}

function makeDrone(hp, ap, dmg) {
    let unit = new Unit(hp, ap);
    unit.addAbility(new Attack(unit, dmg));
    unit.addAbility(new Heal(unit, 3));
    return unit;
}

class Group {
    constructor() {
        this.units = [];
    }
    get size() {
        return this.units.length;
    }
    addUnit(unit) {
        addToArrUnique(this.units, unit);
        unit.group = this;
    }
    removeUnit(unit) {
        removeFromArr(this.units, unit);
    }
    toString() {
        return this.units;
    }
}

let wins = {0: 0, 1: 0};
// for (let iter=0; iter<100; iter++) {
let allies = new Group();
let enemies = new Group();
// let stat = (i) => utils.randomInt(1, i);
let hpI = (i) => 9;
let apI = (i) => 4;
let dmgI = (i) => 1;
for (let i=1; i<20; i++) {
    // if (i > 5)
    allies.addUnit(makeDrone(hpI(i), apI(i), dmgI(i)));
    enemies.addUnit(makeDrone(hpI(i), apI(i), dmgI(i)));
}
// let ship = new Unit(3, 3);
// log(ship);
// ship.attack(targetHealthiest(allies));
    
let turns = 0;
while (allies.units.length > 0 && enemies.units.length > 0) {
    turns += 1;
    log(allies.units.slice().sort((unitA, unitB) => unitA.hp < unitB.hp));
    log(enemies.units.slice().sort((unitA, unitB) => unitA.hp < unitB.hp));
    log(`${allies.size}, ${enemies.size}`);
    log();
    // 0 turn
    if (allies.units.length > 0) {
        for (let unit of allies.units) {
            // unit.use('attack', targetRandom(enemies));
            unit.use('attack', targetHealthiest(enemies));
            // unit.use('attack', targetMostWounded(enemies));
        }
    }
    // 1 turn
    if (enemies.units.length > 0) {
        for (let unit of enemies.units) {
            // unit.use('attack', targetRandom(allies));
            if (Math.random() < 0.5) {
                unit.use('attack', targetHealthiest(allies));
            } else {
                unit.use('heal', targetHealthiest(enemies));
            }
            // unit.use('attack', targetMostWounded(allies));
        }
    }
}
if (allies.units.length === 0) {
    wins[1] += 1;
} else {
    wins[0] += 1;
}
// }
console.log(wins);
console.log(`turns taken: ${turns}`);
log(`${allies.size}, ${enemies.size}`);