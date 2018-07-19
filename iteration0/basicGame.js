const { GameObject } = require('./GameObject');


class Unit extends GameObject{
    constructor(parent, hp, name="drone") {
        super(parent, false, name);
        this.name += `-${this.id}`;
        this.hp = hp;
        this.baseHp = hp;
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
    receiveMsg(sender, str, data) {
        super.receiveMsg(sender, str, data);
        if (str === "DAMAGE") {
            if (data.targets === undefined || data.targets.indexOf(this) > -1) {
                let damage = data.amount;
                console.log(`${this.name} took ${damage} damage from ${sender.name}`);
                this.receiveDamage(damage);
            }
        }
    }
    receiveDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            // TODO: use a dead flag instead and clean?
            this.removeFromParent();
            this.dead = true;
            console.log(this.toString(), 'died');
        }
    }
    toString() {
        // return `[${this.dead ? "dead " : ""}${this.name} ${this.hp}]`;
        return `[HP:${this.hp}/${this.baseHp}]`;
    }
}

class Graphics extends GameObject {
    constructor(parent, colour) {
        super(parent, false, name);
        this.name += `-graphics-${this.id}`;
    }
}

let world = new GameObject(null, false, "world");
let reds = new GameObject(world, true, "reds");
let blues = new GameObject(world, true, "blues");
for (let i=1; i<=2; i++) {
    let redDrone = new Unit(reds, 3, `red-drone`)
    reds.addChild(redDrone);
    let blueDrone = new Unit(blues, 3, `blue-drone`)
    blues.addChild(blueDrone);
}



reds.children[0].sendMsg("DAMAGE", {
    amount: 5,
    targets: [blues.children[0], blues.children[1]]
});
console.log("reds:", reds.children.map(elem => elem.toString()).join("  "));
console.log("blues:", blues.children.map(elem => elem.toString()).join("  "));