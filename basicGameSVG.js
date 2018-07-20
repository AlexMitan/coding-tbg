window.onload = function() {
    const { GameObject } = require('./classes/GameObject');
    const { CharGraphics, BasicSVG } = require('./classes/Graphics');
    const { World } = require('./classes/World');
    const { Unit } = require('./classes/Unit');
    const utils = require('./lib/cmutils');
    // const d3 = require('./lib/d3.v5');
    let fps = 30,
        tick = 1;

    let width = window.innerWidth - 40,
        height = window.innerHeight - 40;
    

    // add an svg
    let svg = d3.select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
    // update mouse XY on mouse move
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'black');

    let world = new World();
    let reds = new GameObject(world, true, "reds");
    let blues = new GameObject(world, true, "blues");
    for (let i=1; i<=20; i++) {
        let redDrone = new Unit(reds, 3, 2, `red-drone`);
        redDrone.x = utils.randomInt(width * 0.1, width * 0.4);
        redDrone.y = utils.randomInt(height * 0.2, height * 0.7);
        // redDrone.addChild(new CharGraphics(redDrone, ctx, "red", "D"));
        redDrone.addChild(new BasicSVG(redDrone, svg, 40, "red"));
        reds.addChild(redDrone);

        let blueDrone = new Unit(blues, 3, 2, `blue-drone`);
        blueDrone.x = utils.randomInt(width * 0.6, width * 0.9);
        blueDrone.y = utils.randomInt(height * 0.2, height * 0.7);
        blueDrone.addChild(new BasicSVG(blueDrone, svg, 40, "blue"));
        // blueDrone.addChild(new CharGraphics(blueDrone, ctx, "blue", "D"));
        blues.addChild(blueDrone);
    }
    
    world.sendMsg("initSVG");

    let turn = 0;
    function update() {
        // rerender
        // show score
        // world.sendMsg("render");
        if (reds.children.length > 0 && blues.children.length > 0) {
            if (turn % 4 == 0) {
                // reds' turn
                // random
                utils.pickFrom(reds.children).attack([utils.pickFrom(blues.children)]);
            } else if (turn % 4 == 2) {
                // blue' turn
                let mostDamaging = reds.children.slice().sort((a, b) => a.dmg > b.dmg)[0];
                utils.pickFrom(blues.children).attack([mostDamaging]);
                // utils.pickFrom(blues.children).attack([utils.pickFrom(reds.children)]);
            }
        } else {
            // game over
            if (blues.children.length === 0) {
                // ctx.fillText("RED WINS", w/2, h/2);
            }
            else {
                // ctx.fillText("BLUE WINS", w/2, h/2);
            }
        }    
        world.sendMsg("cleanup");
        turn += 1;
    }
    setInterval(update, 100);
    // console.log("reds:", reds.children.map(elem => elem.toString()).join("  "));
    // console.log("blues:", blues.children.map(elem => elem.toString()).join("  "));
}


