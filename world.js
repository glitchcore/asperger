
let current_id = 0;
function get_next_id() {
    current_id++;
    return current_id;
}

const EVENT_HISTORY_SIZE = 256;

class WorldNode {

    constructor(name) {
        this.subscribers = [];
        this.event_history = [];

        this.event_handler = null;

        this.name = name;
    }

    emit(event) {
        if(event.id === undefined) {
            event.id = get_next_id();
        }

        let processed = this.event_history.some(history_event => (event.id === history_event));
        console.log("emit:", event, processed, this.event_history);

        if(!processed) {
            this.event_history.push(event.id);
            this.event_history = this.event_history.slice(-EVENT_HISTORY_SIZE);

            if(event.source === this.name || this.event_handler === null || this.event_handler(event)) {
                this.broadcast(event);
            }
        }
    }

    broadcast(event) {
        this.subscribers.forEach((subscriber) => subscriber.emit(event));
    }
}

function subscribe(a, b) {
    a.subscribers.push(b);
    b.subscribers.push(a);
}


class Player extends WorldNode {
    constructor(scene) {
        super("player");

        scene.cmd_cb = (cmd) => {
            scene.add_message({text: "# " + cmd, permanent: false});
            this.emit({
                type: "speak",
                source: this.name,
                text: cmd
            });
        }

        this.event_handler = (event) => {
            if(event.type === "speak") {
                scene.add_message({text: event.source + ": " + event.text, permanent: false});
            }
            
            return false;
        }
    }
}

class NPC extends WorldNode {
    constructor(name) {
        super(name);

        this.n = 0;

        setTimeout(() => {
            console.log("NPC event");
            this.emit({
                type: "speak",
                source: this.name,
                text:"Maybe I can help you",
            });
        }, 3000 + Math.random() * 3000);

        this.event_handler = (event) => {
            if(event.type === "speak" && !event.text.includes("I hear")) {
                setTimeout(() => this.emit({
                    type: "speak",
                    source: this.name,
                    text:`I hear ${event.source === "player" ? "master" : event.source} say ${event.text}`
                }), 1000 + Math.random() * 3000);
            }

            if(event.type === "speak" && event.text.includes("I hear")) {
                setTimeout(() => this.emit({
                    type: "speak",
                    source: this.name,
                    text:`something happened`
                }), 4000 + Math.random() * 3000);
            }
            
            return true;
        }
    }
}

class Location extends WorldNode {
    constructor() {
        super(null);
    }
}

class Door extends WorldNode {
    constructor() {
        super(null);

        this.event_handler = (event) => {
            return false;
        }
    }
}


function world(scene) {
    let player = new Player(scene);
    let npc_sarah = new NPC("Sarah");
    let npc_dave = new NPC("Dave");

    let location_0 = new Location();
    let location_1 = new Location();

    let door = new Door();

    subscribe(player, location_0);
    subscribe(npc_sarah, location_0);

    subscribe(door, location_0);
    subscribe(door, location_1);

    subscribe(npc_dave, location_0);
}