
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

        setInterval(() => {
            console.log("NPC event");
            this.emit({
                type: "speak",
                source: this.name,
                text:"I can help you " + this.n++ + " times!"
            });
        }, 5000 + Math.random() * 2000);

        this.event_handler = (event) => {
            if(event.type === "speak" && !event.text.includes("I hear")) {
                setTimeout(() => this.emit({
                    type: "speak",
                    source: this.name,
                    text:`I hear ${event.source === "player" ? "master" : "you"} say ${event.text}`
                }), 1000 + Math.random() * 1000);
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


function world(main_scene) {
    let player = new Player(main_scene);
    let npc_sarah = new NPC("Sarah");
    let npc_dave = new NPC("Dave");

    let location = new Location();

    subscribe(player, location);
    subscribe(npc_sarah, location);
    subscribe(npc_dave, location);
}