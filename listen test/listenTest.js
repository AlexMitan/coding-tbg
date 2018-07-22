const { GameObject } = require('./GameObject');

class Tile extends GameObject {
    constructor(parent, addtoParent, name, x, y) {
        super(parent, addtoParent, 'tile', name);
        this.x = x;
        this.y = y;
    }
}
GameObject.logMessages = true;
let game = new GameObject(null, false, 'game', 'roguelikeGame');
let tile00 = new GameObject(game, true, 'tile', 'tile00');
let hero = new GameObject(tile00, true, 'unit', 'hero');
let goblin = new GameObject(tile00, true, 'unit', 'goblin');
let tile10 = new GameObject(game, true, 'tile', 'tile10');
let archer = new GameObject(tile10, true, 'unit', 'archer');
let tile20 = new GameObject(game, true, 'tile', 'tile20');
let mage = new GameObject(tile20, true, 'unit', 'mage');

hero.sendMsg("damage", {target: goblin, range: 0});

console.log(GameObject);