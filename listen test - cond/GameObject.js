const utils = require('../lib/cmutils');

class GameObject {
    constructor(parent=null, addToParent=false, type='gameObject', name=null) {
        this.children = [];
        this.parent = parent;
        this.dead = false;
        if (parent && addToParent) {
            parent.addChild(this);
        }
        this.type = type;
        this.name = name;
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
    rootPath() {
        let obj = this;
        let path = [this];
        while (obj.parent != null) {
            obj = obj.parent;
            path.push(obj);
        }
        return path;
    }
    receiveMsg(sender, str, data, nonPropCond=null) {
        if (nonPropCond && nonPropCond(this)) return;
        GameObject.messagesReceived += 1;
        // handle a message, and by default pass it to children and log it
        if (GameObject.logMessages) {
            console.log(`${this.name} <-- ${str} from ${sender.name}`);
        }
        if (str === "cleanup" && this.dead === true) {
            console.log(`${this.name} is being cleaned up.`);
            this.removeFromParent();
        }
        let passToChildren = true;
        if (passToChildren) {
            for (let i=this.children.length - 1; i>=0; i--){
                let child = this.children[i];
                child.receiveMsg(sender, str, data, nonPropCond);
            }
        }
    }
    sendMsg(str, data, nonPropCond=null) {
        // relay a message directly to the root, to be passed down
        this.root().receiveMsg(this, str, data, nonPropCond);
    }
    addChild(gameObj) {
        let childIdx = this.children.indexOf(gameObj);
        if (childIdx == -1){
            this.children.push(gameObj);
        }
    }

    // REMOVAL
    removeChild(gameObj){
        // remove a child from the children array
        let idx = this.children.indexOf(gameObj);
        if (idx > -1){
            this.children.splice(idx, 1);
        }
    }
    removeFromParent() {
        if (this.parent !== null) {
            this.parent.removeChild(this);
            this.parent = null;
        }
    }
    remove() {
        // node-specific operations to avoid memory leaks
        this.recurse('remove', false);
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
GameObject.messagesReceived = 0;
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