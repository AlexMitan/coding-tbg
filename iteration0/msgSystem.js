const { GameObject } = require('./GameObject');

let world = new GameObject(null, null, false);

console.log(world);

let allies = new GameObject(world);

class Group {
    constructor() {
        this.units = [];
    }
    get size() {
        return this.units.length;
    }
    addUnit(unit) {
        let idx = this.units.indexOf(unit);
        if (idx == -1){
            this.units.push(unit);
            unit.group = this;
        }
    }
    removeUnit(unit){
        let idx = this.units.indexOf(unit);
        if (idx > -1){
            this.units.splice(idx, 1);
        }
    }
    toString() {
        return this.units;
    }
}

class Unit {
    constructor(hp, name="drone") {
        this.baseHp = hp;
        this.hp = hp;
        this.name = name;
    }
    // set group(val) {}
    // addAbility(ability) {
    //     this.abilities[ability.name] = ability;
    // }
    // use(abilityName, ...args) {
    //     if (this.abilities[abilityName] !== undefined) {
    //         this.abilities[abilityName].use(...args);
    //     } else {
    //         throw abilityName + ' not owned by this unit';
    //     }
    // }
    receiveDamage(dmg) {
        this.hp -= dmg;
        if (this.hp <= 0) {
            this.group.removeUnit(this);
            // log(this, 'died');
        }
    }
    toString() {
        return `[${this.name} ${this.hp}]`;
        // return `${this.hp < this.baseHp ? 'u' : 'U'}`;
    }
}

// message: sender, string, options
class Channel {
    constructor() {
        this.listeners = [];
    }
    relay(sender, str, data) {
        for (let listener of this.listeners) {
            listener.handle(sender, str, data);
        }
    }
    addUnit(unit) {
        let idx = this.units.indexOf(unit);
        if (idx == -1){
            this.units.push(unit);
            unit.group = this;
        }
    }
    removeUnit(unit){
        let idx = this.units.indexOf(unit);
        if (idx > -1){
            this.units.splice(idx, 1);
        }
    }
}

let reds = new Group();
let blues = new Group();
let fleets = [reds, blues];
let channel = new Channel();
for (let i=1; i<=5; i++) {
    reds.addUnit(new Unit(i*2));
    blues.addUnit(new Unit(i*2));
}

console.log(reds);
