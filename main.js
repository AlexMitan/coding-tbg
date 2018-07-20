(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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



},{"./classes/GameObject":2,"./classes/Graphics":3,"./classes/Unit":4,"./classes/World":5,"./lib/cmutils":6}],2:[function(require,module,exports){
const utils = require('../lib/cmutils');

class GameObject {
    constructor(parent=null, addToParent=false, name=null) {
        this.children = [];
        this.name = name;
        this.parent = parent;
        this.dead = false;
        if (parent && addToParent) {
            parent.addChild(this);
        }
        this.id = GameObject.id;
        GameObject.id += 1;
    }
    root() {
        // TODO: this doesn't change much, set it once and then just return it after
        // get topmost game object, the "world"
        let obj = this;
        while (obj.parent != null) {
            obj = obj.parent;
        }
        return obj;
    }
    receiveMsg(sender, str, data) {
        // handle a message, and by default pass it to children and log it
        let passToChildren = true;
        let log = false;
        if (log) {
            console.log(`${this.name} received ${str} from ${sender.name}`)
        }
        if (str === "cleanup" && this.dead === true) {
            console.log(`${this.name} is being cleaned up.`);
            this.removeFromParent();
        }
        if (passToChildren) {
            for (let i=this.children.length - 1; i>=0; i--){
                let child = this.children[i];
                child.receiveMsg(sender, str, data);
            }
        }
    }
    sendMsg(str, data) {
        // relay a message directly to the world, to be passed down
        this.root().receiveMsg(this, str, data);
    }
    addChild(gameObj) {
        let childIdx = this.children.indexOf(gameObj);
        if (childIdx == -1){
            this.children.push(gameObj);
        }
    }
    removeChild(gameObj){
        let idx = this.children.indexOf(gameObj);
        if (idx > -1){
            this.children.splice(idx, 1);
        }
    }
    removeFromParent() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
        this.recurse('remove');
    }
    logID() {
        console.log(this.id);
    }
    recurse(fnName, applyToSelf=true) {
        for (let child of this.children) {
            child.recurse(fnName);
        }
        if (applyToSelf && this[fnName]) {
            this[fnName]();
        }
    }
}
GameObject.id = 0;

if (false) {
    let world = new GameObject(null, false, "world");
    let redFleet = new GameObject(world, true, "redFleet");
    let blueFleet = new GameObject(world, true, "blueFleet");
    
    let redFighter = new GameObject(redFleet, true, "redFighter");
    let blueFighter = new GameObject(blueFleet, true, "blueFighter");
    
    // let redFighterCannon1 = new GameObject(redFighter, true, "redFighterCannon1");
    // let redFighterCannon2 = new GameObject(redFighter, true, "redFighterCannon2");
    // let blueFighterCannon1 = new GameObject(blueFighter, true, "blueFighterCannon1");
    // let blueFighterCannon2 = new GameObject(blueFighter, true, "blueFighterCannon2");
    
    // blueFighter.remove();
    redFleet.recurse('logID');
    // console.log(redFleet);
    blueFighter.sendMsg('PEW PEW REDS!');
    // for (let obj of [redFighter, blueFighterCannon1, redFleet]) {
    //     console.log(obj.getRoot().id);
    // }
}
module.exports = { GameObject };
},{"../lib/cmutils":6}],3:[function(require,module,exports){
const { GameObject } = require('./GameObject');

class CharGraphics extends GameObject {
    constructor(parent, ctx, colour="blue", char="D") {
        // parent is a unit
        super(parent, false, "charGraphics");
        this.ctx = ctx;
        this.colour = colour;
        this.char = char;
        this.name += `-${this.id}`;
        if (!ctx) {
            console.warn(`Context for ${this.name} is ${ctx}`);
        }
    }
    receiveMsg(sender, str, data) {
        // HACK: better checks for proper targets needed
        if (str === "damage" && sender == this.parent && data.targets && data.targets.length > 0) {
            // console.log(`${this.name} got that ${sender.name} shot`);
            
            // shoot at
            let ctx = this.ctx;
            let { x, y } = this.parent;
            for (let target of data.targets) {
                let targetX = target.x;
                let targetY = target.y;
                // yellow line
                ctx.save();
                ctx.strokeStyle = "orange";
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(targetX, targetY);
                ctx.stroke();
                for (let i=0; i<10; i++) {
                    // random spark
                    ctx.beginPath();
                    ctx.moveTo(targetX, targetY);
                    ctx.lineTo(targetX + Math.random() * 180 - 90,
                               targetY + Math.random() * 180 - 90);
                    ctx.stroke();
                }
                ctx.restore();
            }
        }
        if (str === "render") {
            let ctx = this.ctx;
            let { x, y, hp, baseHp } = this.parent;
            // console.log(`${this.name} is rendering a ${this.colour} [${this.char}] with ${hp} hp.`);
            ctx.save();
            ctx.font = "30px verdana";
            ctx.fillStyle = this.colour;
            ctx.fillText(`[${this.char}]`, x, y);

            // outer health bar
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.rect(x, y+10, 50, 20);
            ctx.fill();
            // inner health bar
            ctx.fillStyle = 'green';
            ctx.beginPath();
            ctx.rect(x+2, y+12, 46 * hp / baseHp, 16);
            ctx.fill();
            // health number
            ctx.font = "15px verdana";
            ctx.fillText(`HP: ${hp}/${baseHp}`, x, y + 50);
            ctx.restore();
        }
    }
}

class BasicSVG extends GameObject {
    constructor(parent, svg, size, colour="blue") {
        // parent is a unit
        super(parent, false, "svgGraphics");
        this.svg = svg;
        this.size = size;
        this.colour = colour;
        this.name += `-${this.id}`;
        if (!svg) {
            console.warn(`Parent for ${this.name} is ${svg}`);
        }
    }
    // removeFromParent() {
        // super.removeFromParent();
    // }
    remove() {
        this.ship.remove();
    }
    receiveMsg(sender, str, data) {
        // HACK: better checks for proper targets needed
        if (str === "damage" && sender === this.parent && data.targets && data.targets.length > 0) {
            console.log(`${this.name} got that ${sender.name} shot`);
            
            // shoot at
            let svg = this.svg;
            let { x, y } = this.parent;
            for (let target of data.targets) {
                let targetX = target.x;
                let targetY = target.y;
                shoot(this.svg, x, y, targetX, targetY, 200, 'white');
            }
        }
        if (str === "initSVG") {
            let svg = this.svg;
            let { x, y, hp, baseHp } = this.parent;
            this.ship = makeShip(this.svg, x, y, this.size);
        }
        if (str === "death" && sender === this.parent) {
            console.log(`${this.name} received death of parent`);
            boom(this.svg, this.parent.x, this.parent.y, this.size*2, 500, 'cyan');
        }
    }

}

function beam(svg, x0, y0, x1, y1, duration) {
    svg.append('path')
        .attr('d', `M${x0} ${y0} L${x1} ${y1} L${x1} ${y1+2} Z`)
        .attr('fill', 'orange')
        .transition()
            .duration(duration)
            .style('opacity', 0)
            .remove();
}

function shoot(svg, x0, y0, x1, y1, duration, colour='orange') {
    for (let i=0; i<1; i++) {
        svg.append('circle')
            .attrs({'cx':x0, 'cy':y0, 'r':5, 'fill':colour})
            .transition(d3.easeLinear)
                .delay(i * 10)
                .duration(duration)
                .attrs({'cx':x1, 'cy':y1})
                .remove()
                .on('end', () => boom(svg, x1, y1, 40, 200, colour));
    }
}

function boom(svg, x, y, size, duration, colour='orange') {
    svg.append('ellipse')
        .attrs({'cx': x, 'cy': y, 'rx': 0.1 * size, 'ry': 0.05 * size, 'fill': colour})
        .transition()
            .duration(duration)
            .attrs({'rx': size, 'ry': size})
            .style('opacity', 0)
            .remove();
}

function makeShip(svg, x, y, size=30) {

    const getTransform = (x, y, ang=0, scale=1) => `translate(${x} ${y})` + `rotate(${ang})` + `scale(${scale})`;
    let g = svg.append('g').attr('transform', getTransform(x, y, 0, size));
    // let g = d3.g();
    
    // g.append('circle')
    //     .attrs({'fill':'red', 'r':1, 'dx':0, 'dy':0});
    // body
    g.append('polygon')
        // .classed('body', true)
        .attr('points', `-0.1,-0.2
                         -0.7,-0.2
                         -0.85,-0.55,
                         0.8,-0.55
                         0.8,0.9
                         -0.1,0.8`)
        .attr('fill', '#555555')
        .attr('stroke', 'black')
        .attr('stroke-width', size / 10000);
        
    g.append('circle')
        .attrs({'fill':'cyan', 'r':0.15, 'cx':-0.35, 'cy':0.05})//.attrs({'stroke':'black', 'stroke-width': size/10000});
        
    g.append('circle')
        .attrs({'fill':'cyan', 'r':0.15, 'cx':-0.35, 'cy':0.55})//.attrs({'stroke':'black', 'stroke-width': size/10000});
            

    return g;
}

module.exports = { CharGraphics, BasicSVG };

},{"./GameObject":2}],4:[function(require,module,exports){
const { GameObject } = require('./GameObject');

class Unit extends GameObject{
    constructor(parent, hp, damage, name="drone") {
        super(parent, false, name);
        this.name += `-${this.id}`;
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
},{"./GameObject":2}],5:[function(require,module,exports){
const { GameObject } = require('./GameObject');

class World extends GameObject{
    constructor() {
        super(null, false, "world");
        this.stats = {
            deaths: {}
        }
    }

    receiveMsg(sender, str, data) {
        super.receiveMsg(sender, str, data);
        if (str === "death") {
            // get id of fleet
            let fleetID = sender.parent.id;
            console.log(`${fleetID} lost a unit`);
            if (this.stats.deaths[fleetID] === undefined) {
                this.stats.deaths[fleetID] = 0;
            } else {
                this.stats.deaths[fleetID] += 1;
            }
        }
    }
}

module.exports = { World };
},{"./GameObject":2}],6:[function(require,module,exports){
const cmutils = {};


// utility function for printing objects using their `toString` methods
cmutils.log = (...any) => console.log(...any.map(String));

// Array ops

cmutils.pickFrom = function(arr) {
    var i = Math.floor(Math.random() * arr.length);
    return arr[i];
}

cmutils.shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
    
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
  
    return array;
}

cmutils.makeFromArr = function(arr, len) {
    var elem = "";
    for (var i = 0; i < len; i++) {
        elem += pickFrom(arr);
    }
    return elem;
}

cmutils.removeFromArr = function(arr, elem) {
    let idx = arr.indexOf(elem);
    if (idx > -1){
        arr.splice(idx, 1);
    }
}

cmutils.addToArrUnique = function(arr, elem) {
    let idx = arr.indexOf(elem);
    if (idx === -1){
        arr.push(elem);
    }
}

// Angle conversions

cmutils.degToRad = function(deg) {
    return deg / 180 * Math.PI;
}
cmutils.radToDeg = function(rad) {
    return rad * 180 / Math.PI;
}

cmutils.getVal = function(ctx, x, y) {
    var ext = ctx.getImageData(x, y, 1, 1).data;
    if (ext[3] == 0) {
        return 0;
    } else {
        return (ext[0] + ext[1] + ext[2]) / 3 / 2.56;
    }
}

cmutils.genMat = function(w, h, init, explicit) {
    var mat = [];
    for (var x = 0; x < w; x++) {
        mat.push([]);
        for (var y = 0; y < h; y++) {
            mat[x].push(init || 0);
        }
    }
    if (explicit) {
        console.log("made matrix:", mat);
    }
    return mat;
}

cmutils.logMat = function(mat) {
    for (var y = mat[0].length - 1; y >= 0; y--) {
        var str = ""
        for (var x = 0; x < mat.length; x++) {
            str += (mat[x][y] ? mat[x][y] : "#") + ",";
        }
        console.log(str);
        console.log("");
    }
}


cmutils.randomWithin = function(rMin, rMax, seed) {
    if (seed === undefined) {
        var max = rMax || 1;
        var min = rMin || 0;
        return min + Math.random() * (max - min);
    } else {
        //Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
        var max = rMax || 1;
        var min = rMin || 0;
        seed = (seed * 9301 + 49297) % 233280;
        var rnd = seed / 233280.0;
        return min + rnd * (max - min);
    }
}

cmutils.norm = function(value, min, max) {
    return (value - min) / (max - min);
};

cmutils.lerp = function(norm, min, max) {
    return (max - min) * norm + min;
};

cmutils.map = function(value, sourceMin, sourceMax, destMin, destMax) {
    return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
};

cmutils.clamp = function(value, min, max) {
    return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
};

cmutils.distP = function(p0, p1) {
    var dx = p0.x - p1.x,
        dy = p0.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
};

cmutils.dist = function(x0, y0, x1, y1) {
    var dx = x1 - x0,
        dy = y1 - y0;
    return Math.sqrt(dx * dx + dy * dy);
};

cmutils.randomFloat = function(min, max) {
    return min + Math.random() * (max - min);
};

cmutils.randomInt = function(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
};

cmutils.inRange = function(value, min, max) {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
};

cmutils.angleQuad = function(angle) {
    if (angle >= 0)
        if (angle <= Math.PI / 2)
            return 1;
        else return 2;
    else return 0;
};

cmutils.circleCollision = function(c0, c1) {
    return utils.distance(c0, c1) <= c0.radius + c1.radius;
};

cmutils.circlePointCollision = function(x, y, circle) {
    return utils.distanceXY(x, y, circle.x, circle.y) < circle.radius;
};

cmutils.pointInRect = function(x, y, rect) {
    return utils.inRange(x, rect.x, rect.x + rect.width) && utils.inRange(y, rect.y, rect.y + rect.height);
};

cmutils.rangeIntersect = function(min0, max0, min1, max1) {
    return Math.max(min0, max0) >= Math.min(min1, max1) && Math.min(min0, max0) <= Math.max(min1, max1);
};

cmutils.rectIntersect = function(r0, r1) {
    return utils.rangeIntersect(r0.x, r0.x, r0.width, r1.x, r1.x + r1.width) && utils.rangeIntersect(r0.y, r0.y + height, r1.y, r1.y + height);
};

cmutils.segmentIntersect = function(p0, p1, p2, p3) {
    var A1 = p1.y - p0.y,
        B1 = p0.x - p1.x,
        C1 = A1 * p0.x + B1 * p0.y,
        A2 = p3.y - p2.y,
        B2 = p2.x - p3.x,
        C2 = A2 * p2.x + B2 * p2.y,
        denominator = A1 * B2 - A2 * B1;

    if (denominator === 0) {
        return null;
    }

    var intersectX = (B2 * C1 - B1 * C2) / denominator,
        intersectY = (A1 * C2 - A2 * C1) / denominator,
        rx0 = (intersectX - p0.x) / (p1.x - p0.x),
        ry0 = (intersectY - p0.y) / (p1.y - p0.y),
        rx1 = (intersectX - p2.x) / (p3.x - p2.x),
        ry1 = (intersectY - p2.y) / (p3.y - p2.y);

    if (((rx0 >= 0 && rx0 <= 1) || (ry0 >= 0 && ry0 <= 1)) &&
        ((rx1 >= 0 && rx1 <= 1) || (ry1 >= 0 && ry1 <= 1))) {
        return {
            x: intersectX,
            y: intersectY
        };
    } else {
        return null;
    }
}

cmutils.segTouching = function(s0, s1) {
    if (s0.x0 == s1.x1 && s0.y0 == s1.y1 ||
        s0.x1 == s1.x0 && s0.y1 == s1.y0 ||
        s0.x0 == s1.x0 && s0.y0 == s1.y0 ||
        s0.x1 == s1.x1 && s0.y1 == s1.y1) {
        return true;
    }
    return false;
}

cmutils.segInters = function(s0, s1, allowTouching) {
    if (!allowTouching && segTouching(s0, s1)) {
        return null;
    }
    var A1 = s0.y1 - s0.y0,
        B1 = s0.x0 - s0.x1,
        C1 = A1 * s0.x0 + B1 * s0.y0,
        A2 = s1.y1 - s1.y0,
        B2 = s1.x0 - s1.x1,
        C2 = A2 * s1.x0 + B2 * s1.y0,
        denominator = A1 * B2 - A2 * B1;

    var A1 = s0.y1 - s0.y0,
        B1 = s0.x0 - s0.x1,
        C1 = A1 * s0.x0 + B1 * s0.y0,
        A2 = s1.y1 - s1.y0,
        B2 = s1.x0 - s1.x1,
        C2 = A2 * s1.x0 + B2 * s1.y0,
        denominator = A1 * B2 - A2 * B1;

    if (denominator === 0) {
        return null;
    }

    var intersectX = (B2 * C1 - B1 * C2) / denominator,
        intersectY = (A1 * C2 - A2 * C1) / denominator,
        rx0 = (intersectX - s0.x0) / (s0.x1 - s0.x0),
        ry0 = (intersectY - s0.y0) / (s0.y1 - s0.y0),
        rx1 = (intersectX - s1.x0) / (s1.x1 - s1.x0),
        ry1 = (intersectY - s1.y0) / (s1.y1 - s1.y0);

    if (((rx0 >= 0 && rx0 <= 1) || (ry0 >= 0 && ry0 <= 1)) &&
        ((rx1 >= 0 && rx1 <= 1) || (ry1 >= 0 && ry1 <= 1))) {
        return {
            x: intersectX,
            y: intersectY
        };
    } else {
        return null;
    }
}

module.exports = cmutils;
},{}]},{},[1]);
