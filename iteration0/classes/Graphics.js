const { GameObject } = require('./GameObject');

class CharGraphics extends GameObject {
    constructor(parent, ctx, colour="blue", char="D") {
        // parent is a unit
        super(parent, false, "charGraphics");
        this.ctx = ctx;
        this.colour = colour;
        this.char = char;
        this.name += `-${this.id}`;
    }
    receiveMsg(sender, str, data) {
        if (str === "render") {
            let hp = this.parent.hp;
            console.log(`${this.name} is rendering a ${this.colour} [${this.char}] with ${hp} hp.`);
        }
    }
}

module.exports = { CharGraphics };
