class GameObject {
    constructor(world, parent, addToParent=true) {
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
        removeFromArr(this.children, gameObj);
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

if (true) {
    let world = {};
    let mothership = new GameObject(world);
    
    let fighter = new GameObject(world, mothership);
    let interceptor = new GameObject(world, mothership);
    
    let fighterCannon1 = new GameObject(world, fighter);
    let fighterCannon2 = new GameObject(world, fighter);
    let interceptorCannon1 = new GameObject(world, interceptor);
    let interceptorCannon2 = new GameObject(world, interceptor);
    
    mothership.recurse('getID');
    // for (let obj of [fighter, interceptorCannon1, mothership]) {
    //     console.log(obj.getRoot().id);
    // }
}
