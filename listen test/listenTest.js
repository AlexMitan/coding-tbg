const { GameObject } = require('./GameObject');

class Tile extends GameObject {
    constructor(parent, addtoParent, name, x, y) {
        super(parent, addtoParent, 'tile', name);
        this.x = x;
        this.y = y;
    }
    distanceTo(tile) {
        return Math.abs(tile.x - this.x) + Math.abs(tile.y - this.y);
    }
    receiveMsg(sender, str, data) {
        super.receiveMsg(sender, str, data);
    }
}

class Unit extends GameObject {
    constructor(parent, addtoParent, hp, damage, name="drone") {
        super(parent, addtoParent, 'unit', name);
        this.damage = damage;
        this.hp = hp;
        this.baseHp = hp;
        this.name += `-${this.id}`;
    }

    receiveMsg(sender, str, data) {
        super.receiveMsg(sender, str, data);
        if (str === "damage") {
            // if unit in targets
            if (data.targets.indexOf(this) > -1) {
                let damage = data.amount;
                console.log(`${this.name} took ${damage} damage from ${sender.name}`);
                this.receiveDamage(damage, sender);
            }
        }
    }
    receiveDamage(damage, attacker) {
        this.hp -= damage;
        if (this.hp <= 0) {
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
        return `[${this.name} ${this.dead ? 'XXX' : `HP:${this.hp}/${this.baseHp}`}]`;
    }
}

GameObject.logMessages = true;
let game = new GameObject(null, false, 'game', 'roguelikeGame');

let tile00 = new Tile(game, true, 'tile00', 0, 0);
let hero = new Unit(tile00, true, 10, 5, 'hero');
let goblin = new Unit(tile00, true, 4, 3, 'goblin');

let tile10 = new Tile(game, true, 'tile10', 1, 0);
let archer = new Unit(tile10, true, 1, 4, 'archer');

let tile20 = new Tile(game, true, 'tile20', 2, 0);
let necromancer = new Unit(tile20, true, 1, 1, 'necro');

console.log(goblin.toString());
hero.attack([goblin]);
console.log(goblin.toString());

console.log(GameObject);
console.log(tile00.distanceTo(tile20));