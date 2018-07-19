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
        if (str === "render") {
            let ctx = this.ctx;
            let { x, y, hp, baseHp } = this.parent;
            console.log(`${this.name} is rendering a ${this.colour} [${this.char}] with ${hp} hp.`);
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

module.exports = { CharGraphics };
