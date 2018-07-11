class GameObject {
    constructor(world, prnt, addToprnt=false) {
        this.world = world;
        this.children = [];
        this.prnt = prnt || null;
        if (prnt && addToprnt) {
            prnt.addChild(this);
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
        while (obj.prnt != null) {
            obj = obj.prnt;
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
        if (this.prnt) {
            this.prnt.removeChild(this);
        }
    }
}
GameObject.id = 0;

if (false) {
    var world = {};
    var mothership = new GameObject(world);
    
    var fighter = new GameObject(world, mothership);
    var interceptor = new GameObject(world, mothership);
    
    var fighterCannon1 = new GameObject(world, fighter);
    var fighterCannon2 = new GameObject(world, fighter);
    var interceptorCannon1 = new GameObject(world, interceptor);
    var interceptorCannon2 = new GameObject(world, interceptor);
    
    mothership.recurse('getID');
    for (let obj of [fighter, interceptorCannon1, mothership]) {
        console.log(obj.getRoot().id);
    }
}
