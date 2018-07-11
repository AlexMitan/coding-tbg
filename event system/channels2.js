class Subject {
    constructor(world, name) {
        this.name = name;
        this.output = {};
        this.world = world;
    }
    subscribe(label) {
        let channels = this.world.channels;
        if (channels[label] === undefined) {
            channels[label] = [];
        }
        if (channels[label].indexOf(this) === -1) {
            channels[label].push(this);
        }
    }
    unsubscribe(label) {
        let channels = this.world.channels;
        if (channels[label] !== undefined){
            let channelIdx = channels[label].indexOf(this);
            if (channelIdx > -1) {
                channels[label].splice(channelIdx, 1);
            }
        } else {
            console.warn(this.name + ' unsubscribed from an undefined channel ' + label);
        }
    }
    notify(label, eventName, pack) {
        this.world.broadcast(label, this, eventName, pack);
    }
    receive(eventName, pack) {
        console.log(this.name + ' has received ' + eventName);
    }
}
class World {
    constructor() {
        this.channels = {
            'test': [{}, {}]
        };
    }
    broadcast(label, obj, eventName, pack) {
        if (this.channels[label] !== undefined) {
            console.log(obj.name + ' is transmitting ' + eventName + ' to ' + label);
            for (let receiver of this.channels[label]) {
                receiver.receive(eventName, pack);
            }
        }
    }
}


let world = new World();

let alien = new Subject(world, 'alien'),
    robot = new Subject(world, 'robot');

alien.notify('shoot', 'PEW PEW');
alien.subscribe('shoot');
alien.subscribe('shoot');
alien.notify('shoot', 'PEW PEW');
alien.unsubscribe('shoot');
alien.unsubscribe('physics');
robot.notify('shoot', 'ZAP ZAP');