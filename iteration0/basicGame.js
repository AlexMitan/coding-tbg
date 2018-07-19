window.onload = function() {
    const { GameObject } = require('./classes/GameObject');
    const { CharGraphics } = require('./classes/Graphics');
    const { Unit } = require('./classes/Unit');
    const d3 = require('./lib/d3.v5');
    const utils = require('./lib/cmutils');
    const bub = require('./lib/bub');
    var canvas = document.getElementById("paper"),
        ctx = canvas.getContext("2d"),
        w = canvas.width = window.innerWidth,
        h = canvas.height = window.innerHeight,
        fps = 30,
        frames = 1,
        mX, mY, mRX, mRY, leftMouseDown, rightMouseDown,
        keysDown = {};

    bub.ctx = ctx;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.lineWidth = 1;


    let world = new GameObject(null, false, "world");
    let reds = new GameObject(world, true, "reds");
    let blues = new GameObject(world, true, "blues");
    for (let i=1; i<=5; i++) {
        let redDrone = new Unit(reds, 3, `red-drone`);
        redDrone.x = utils.randomInt(100, 300);
        redDrone.y = utils.randomInt(100, 700);
        redDrone.addChild(new CharGraphics(redDrone, ctx, "red", "D"));
        reds.addChild(redDrone);

        let blueDrone = new Unit(blues, 3, `blue-drone`);
        blueDrone.x = utils.randomInt(400, 700);
        blueDrone.y = utils.randomInt(100, 700);
        blueDrone.addChild(new CharGraphics(blueDrone, ctx, "blue", "D"));
        blues.addChild(blueDrone);
    }
    
    // ctx.fillText("HAA", 20, 20);
    // ctx.strokeText("HAA", 60, 20);
    reds.children[0].sendMsg("DAMAGE", {
        amount: 2,
        targets: [blues.children[0], blues.children[1]]
    });
    // console.log("reds:", reds.children.map(elem => elem.toString()).join("  "));
    // console.log("blues:", blues.children.map(elem => elem.toString()).join("  "));
    world.sendMsg("render");
}


