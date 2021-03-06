const { GameObject } = require('./GameObject');

class Unit extends GameObject{
    constructor(parent, hp, damage) {
        super(parent, false, 'unit');
        this.damage = damage;
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
        if (str === "damage") {
            // if unit in targets
            if (data.targets.indexOf(this) > -1) {
                let damage = data.amount;
                // console.log(`${this.name} took ${damage} damage from ${sender.name}`);
                this.receiveDamage(damage, sender);
            }
        }
    }
    receiveDamage(damage, attacker) {
        this.hp -= damage;
        if (this.hp <= 0) {
            // TODO: use a dead flag instead and clean?
            // TODO: remove things recursively?
            this.sendMsg("death", {});
            this.dead = true;
            console.log(`${this.toString()} killed by ${attacker.toString()}`);
            // clip
            // this.removeFromParent();
            // recursively trigger removals
            // this.remove();
        }
    }
    attack(targets) {
        this.sendMsg("damage", {
            amount: this.damage,
            targets: targets
        });
    }
    toString() {
        // return `[${this.dead ? "dead " : ""}${this.name} ${this.hp}]`;
        return `[HP:${this.hp}/${this.baseHp}]`;
    }
}

module.exports = { Unit };