const { GameObject } = require('./GameObject');

class CharGraphics extends GameObject {
    constructor(parent, ctx, colour="blue", char="D") {
        // parent is a unit
        super(parent, false, "charGraphics");
        this.ctx = ctx;
        this.colour = colour;
        this.char = char;
        this.name += `-${this.id}`;
        this.type = 'charGraphics';
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

class SvgGraphics extends GameObject {
    constructor(parent, svg, size, colour="blue") {
        // parent is a unit
        super(parent, false, 'svgGraphics');
        this.svg = svg;
        this.size = size;
        this.colour = colour;
        this.name += `-${this.id}`;
        if (!svg) {
            console.warn(`Parent for ${this.name} is ${svg}`);
        }
    }
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

module.exports = { CharGraphics, SvgGraphics };
