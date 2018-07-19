const utils = require('./cmutils');

class GameObject {
    constructor(world, parent, addToParent=false) {
        this.world = world;
        this.children = [];
        this.parent = parent || null;
        if (parent && addToParent) {
            parent.addChild(this);
        }
        this.id = GameObject.id;
        GameObject.id += 1;
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
    getRoot() {
        let obj = this;
        while (obj.parent != null) {
            obj = obj.parent;
        }
        return obj;
    }
    getID() {
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
    remove() {
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }
}
GameObject.id = 0;

if (false) {
    let world = {};
    let mothership = new GameObject(world, true);
    
    let fighter = new GameObject(world, mothership, true);
    let interceptor = new GameObject(world, mothership, true);
    
    let fighterCannon1 = new GameObject(world, fighter, true);
    let fighterCannon2 = new GameObject(world, fighter, true);
    let interceptorCannon1 = new GameObject(world, interceptor, true);
    let interceptorCannon2 = new GameObject(world, interceptor, true);
    
    interceptor.remove();
    mothership.recurse('getID');
    console.log(mothership);
    
    // for (let obj of [fighter, interceptorCannon1, mothership]) {
    //     console.log(obj.getRoot().id);
    // }
}
module.exports = { GameObject };