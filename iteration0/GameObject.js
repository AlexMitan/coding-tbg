const utils = require('./cmutils');

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
    }
    logID() {
        console.log(this.id);
    }
    recurse(fnName, applyToSelf=true) {
        if (applyToSelf && this[fnName]) {
            this[fnName]();
        }
        for (let child of this.children) {
            child.recurse(fnName);
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