const utils = require('./cmutils');

class GameObject {
    constructor(parent, addToParent=false, name=null) {
        this.children = [];
        this.name = name;
        this.parent = parent || null;
        if (parent && addToParent) {
            parent.addChild(this);
        }
        this.id = GameObject.id;
        GameObject.id += 1;
    }
    sendMsg(str, data) {
        this.root().receiveMsg(this, str, data);
    }
    receiveMsg(sender, str, data) {
        let passToChildren = true;
        let log = true;
        if (passToChildren) {
            for (let child of this.children) {
                child.receiveMsg(sender, str, data);
            }
        }
        if (log) {
            console.log(`${this.name} received ${str} from ${sender.name}`)
        }
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
    root() {
        let obj = this;
        while (obj.parent != null) {
            obj = obj.parent;
        }
        return obj;
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

if (true) {
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