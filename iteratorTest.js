class Drone {
    constructor(damage, reload) {
        this.damage = damage;
        this.baseReload = reload;
        this.AP = 0;
        this.maxAP = 10;
        this.state = "idle";
    }
    normalAttack() {
        this.AP -= 1;
        if (this.AP <= 0) {
            console.log("pew pew!");
            this.AP = this.baseReload;
            return true;
        } else {
            console.log(`on cooldown: ${this.AP}`);
            return false;
        }
    }
    *step() {
        while (true) {
            this.AP = Math.min(this.AP + 1, this.maxAP);
            // console.log(`in state ${this.state}: ${this.AP}`);
            switch(this.state) {
                case "idle":
                    console.log("...");
                    yield;
                    break;
                case "firing":
                    if (this.AP >= 2) {
                        console.log("pew!");
                        this.AP -= 2;
                        yield;
                    } else {
                        console.log(`...`);
                        yield;
                    }
                    break;
                case "burst":
                    if (this.AP >= 4) {
                        console.log("BOOM BOOM!");
                        this.AP -= 4;
                        yield;
                    } else {
                        console.log(`...`);
                        yield;
                    }
                    break;
            }
        }
    }
}

let drone1 = new Drone(5, 2);
let drone2 = new Drone(5, 2);
for (let i=0; i<40; i++) {
    drone1.step().next();
    // drone2.step().next();
    if (i > 5) {
        drone1.state = "burst";
    }
    if (i > 30) {
        drone1.state = "firing";
    } 
    if (i > 37) {
        drone1.state = "idle";
    }
}