const { GameObject } = require('./GameObject');
const { ListenHash } = require('./ListenHash');

class Tile extends GameObject {
    constructor(parent, addtoParent, name, x, y, listenHash={}) {
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
    constructor(parent, addtoParent, hp, damage, name=null, listenHash={"damage": 1}) {
        super(parent, addtoParent, 'unit', name, listenHash);
        this.damage = damage;
        this.hp = hp;
        this.baseHp = hp;
    }

    receiveMsg(sender, str, data) {
        if (!super.receiveMsg(sender, str, data)) return false;
        if (str === "damage") {
            // if unit in targets
            if (data.targets.indexOf(this) > -1) {
                let damage = data.amount;
                console.log(`${this.name} took ${damage} damage from ${sender.name}`);
                this.receiveDamage(damage, sender);
            }
        }
        return true;
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
let necromancer = new Unit(tile20, true, 1, 1, 'necro', {"death":1});
let spellOrb1 = new GameObject(necromancer, true, 'misc', 'spellOrb1');
let spellOrb2 = new GameObject(necromancer, true, 'misc', 'spellOrb2');



// console.log(goblin.toString());
hero.attack([goblin]);
// console.log(goblin.toString());

console.log(GameObject);
// console.log(tile00.distanceTo(tile20));


// console.log('initial paths');
// console.log(archer.rootPath().map(e => e.name));
// console.log(archer.rootPath().map(e => e.listenHash));
// console.log();
// console.log(spellOrb1.rootPath().map(e => e.name));
// console.log(spellOrb1.rootPath().map(e => e.listenHash));


// console.log('removed spellorb 2');
// necromancer.removeChild(spellOrb2);
// console.log();
// console.log(spellOrb1.rootPath().map(e => e.name));
// console.log(spellOrb1.rootPath().map(e => e.listenHash));

// console.log('removed necro');
// necromancer.removeFromParent();
// console.log();
// console.log(spellOrb1.rootPath().map(e => e.name));
// console.log(spellOrb1.rootPath().map(e => e.listenHash));
// console.log();
// console.log(archer.rootPath().map(e => e.name));
// console.log(archer.rootPath().map(e => e.listenHash));

// let hash1 = {"damage": 2, "death": 1};
// let hash2 = {"heal": 1}
// let hash3 = {"damage": 1, "heal": 5};
// let hash4 = ListenHash.addHashes(hash1, hash2, hash3);

// console.log(hash4);
// console.log(ListenHash.subtractHashes(hash4, hash2, hash1));