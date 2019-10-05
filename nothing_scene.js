function Nothing_scene(pixi) {
    let scene = new Container();

    const margin_left = 30;

    let background = new Graphics()
        .beginFill(0x000000)
        .drawRect(0, 0, pixi.screen.width, pixi.screen.height)
        .endFill();

    scene.addChild(background);

    const text_bottom = 600;
    const font_height = 40;
    const text_top = 100;

    {
        let message = new Text("Y O U R CH A T", DARK_STYLE_H1);
        message.position.set(margin_left, text_top - 56);
        scene.addChild(message);
    }

    

    let cursor = new Graphics()
        .beginFill(0xFFFFFF)
        .drawRect(10, 600, 20, 45)
        .endFill();

    scene.addChild(cursor);

    let type_text = [];
    function add_letter(letter) {
        let message = new Text(letter, DARK_STYLE_H2);
        message.position.set(margin_left + type_text.length * 40, text_bottom);
        message.letter = letter;
        
        scene.addChild(message);

        type_text.push(message);
    };
    function remove_letter() {
        let letter = type_text.pop();
        scene.removeChild(letter);
    }
    function clear_letters() {
        type_text.forEach(letter => scene.removeChild(letter));
        type_text = [];
    }
    function clear_letter() {
        let code_length = type_text.length;
        for(let i = 0; i < code_length; i++) {
            remove_letter();
        }
    }

    /*
    let log_text = new Text("simple message", DARK_STYLE_H2);
    log_text.position.set(margin_left, 150);
    scene.addChild(log_text);
    */

    let messages = [];
    const MESSAGES_SIZE = 10;
    scene.add_message = (next_message) => {
        let text = new Text(next_message.text, next_message.permanent ? RED_STYLE_H2 : DARK_STYLE_H2);
        text.position.set(margin_left, text_bottom - font_height);
        scene.addChild(text);

        text.permanent = next_message.permanent;

        messages.push(text);

        let top_index = 0;
        for(let i = 0; i < messages.length; i++) {
            if(messages[i].permanent) {
                top_index = i + 1;
            } else {
                break;
            }
        }

        messages = messages
        .map((message, idx) => {
            if(message.permanent) {
                if(message.position.y - font_height >= (text_top + top_index * font_height)) {
                    message.position.y -= font_height;
                }
                return message;
            } else {
                message.position.y -= font_height;
                if(message.position.y < (text_top + top_index * font_height)) {
                    scene.removeChild(message);
                    return null;
                } else {
                    return message;
                }
            }
        })
        .filter(message => (message !== null));

        console.log(messages.length);
    }

    scene.update = (delta, now) => {
        // console.log(Math.floor(now) % 2);
        cursor.visible = (Math.floor(now/500) % 2 > 0);
        cursor.x = type_text.length * 40 + margin_left;
        /*if(cursor.visible === true) {
             false;
        } else {
            cursor.visible = true;
        }*/
    };

    scene.cmd_cb = null;

    scene.key_handler = (key, isPress) => {
        if(isPress === true) {
            if(key === 13) { // pressed enter
                let code = type_text.map(item => item.letter).join("");
                if(code === "") {
                    code = "0XBEGIN";
                }

                if(scene.cmd_cb !== null) {
                    scene.cmd_cb(code);
                }
                
                clear_letters();
                
            }

            if(key === 8) {
                // console.log("delete character");
                remove_letter();
            }

            if(key > 46 && key < 91 || key === 32) {
                let char = String.fromCharCode(key);
                // console.log("press:", char);
                add_letter(char);
            }
        }
    };

    scene.select = () => {
        clear_letter();
    };

    return scene;
}