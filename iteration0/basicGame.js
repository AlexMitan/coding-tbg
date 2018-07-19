const { GameObject } = require('./classes/GameObject');
const { CharGraphics } = require('./classes/Graphics');
const { Unit } = require('./classes/Unit');
const d3 = require('./lib/d3.v5');


let world = new GameObject(null, false, "world");
let reds = new GameObject(world, true, "reds");
let blues = new GameObject(world, true, "blues");
for (let i=1; i<=2; i++) {
    let redDrone = new Unit(reds, 3, `red-drone`);
    redDrone.addChild(new CharGraphics(redDrone, null, "red", "D"));
    reds.addChild(redDrone);

    let blueDrone = new Unit(blues, 3, `blue-drone`);
    blueDrone.addChild(new CharGraphics(blueDrone, null, "blue", "D"));
    blues.addChild(blueDrone);
}



reds.children[0].sendMsg("DAMAGE", {
    amount: 2,
    targets: [blues.children[0], blues.children[1]]
});
console.log("reds:", reds.children.map(elem => elem.toString()).join("  "));
console.log("blues:", blues.children.map(elem => elem.toString()).join("  "));

world.sendMsg("render");