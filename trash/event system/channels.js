class Transmitter {
    constructor(name) {
        this.name = name;
        this.output = [];
        this.input = [];
    }
    addOutputChannel(channel) {
        this.output.push(channel);
    }
    addInputChannel(channel) {
        channel.receivers.push(this);
    }
    notify(eventName, pack) {
        for (let channel of this.output) {
            channel.broadcast(eventName, pack);
        }
    }
    receive(eventName, pack) {
        console.log(this.name + ' has received ' + eventName);
    }
}
class Relay {
    constructor(name) {
        this.name = name;
        this.receivers = [];
    }
    broadcast(eventName, pack) {
        console.log(this.name + ' is transmitting ' + eventName);
        for (let receiver of this.receivers) {
            receiver.receive(eventName, pack);
        }
    }
}

let alien = new Transmitter('alien'),
    robot = new Transmitter('robot');

let relayA = new Relay('allied'),
    relayB = new Relay('recon');

robot.addOutputChannel(channelA);
alien.addOutputChannel(channelA);
alien.addOutputChannel(channelB);

alien.addInputChannel(channelA);
robot.addInputChannel(channelA);
robot.addInputChannel(channelB);

alien.broadcast('ALIEN MESSAGE');