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
        let redDrone = new Unit(reds, 7, 2, `red-drone`);
        redDrone.x = utils.randomInt(w * 0.1, w * 0.4);
        redDrone.y = utils.randomInt(h * 0.2, h * 0.8);
        redDrone.addChild(new CharGraphics(redDrone, ctx, "red", "D"));
        reds.addChild(redDrone);

        let blueDrone = new Unit(blues, 7, 2, `blue-drone`);
        blueDrone.x = utils.randomInt(w * 0.4, w * 0.9);
        blueDrone.y = utils.randomInt(h * 0.2, h * 0.8);
        blueDrone.addChild(new CharGraphics(blueDrone, ctx, "blue", "D"));
        blues.addChild(blueDrone);
    }
    
    // ctx.fillText("HAA", 20, 20);
    // ctx.strokeText("HAA", 60, 20);
    let turn = 0;
    function update() {
        // rerender
        ctx.clearRect(0, 0, w, h);
        world.sendMsg("render");
        if (reds.children.length > 0 && blues.children.length > 0) {
            if (turn % 4 == 0) {
                // reds' turn
                // most wounded
                let wounded = blues.children.slice().sort((a, b) => a.health > b.health)[0]
                utils.pickFrom(reds.children).attack([wounded]);
                // utils.pickFrom(reds.children).attack([utils.pickFrom(blues.children)]);
            } else if (turn % 4 == 2) {
                // blue' turn
                utils.pickFrom(blues.children).attack([utils.pickFrom(reds.children)]);
            }
        } else {
            // game over
            if (blues.children.length === 0)
                ctx.fillText("RED WINS", w/2, h/2);
            else
                ctx.fillText("BLUE WINS", w/2, h/2);
        }    
        turn += 1;
    }
    setInterval(update, 200);
    // console.log("reds:", reds.children.map(elem => elem.toString()).join("  "));
    // console.log("blues:", blues.children.map(elem => elem.toString()).join("  "));
}


