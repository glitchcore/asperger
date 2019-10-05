let update = () => {};
let key_handler = (key, isPress) => {};

let main_scene;

function app(pixi) {
    let stage = pixi.stage;

    PIXI.utils.sayHello("LD45 begin!");

    main_scene = Main_scene(pixi);
    main_scene.visible = false;
    stage.addChild(main_scene);

    world(main_scene);

    window.addEventListener(
        "keydown",
        (event) => {
            key_handler(event.keyCode, true);
            if(event.keyCode !== 116 && event.keyCode !== 122/* && event.keyCode !== 123*/) {
                event.preventDefault();
            }
        },
        false
    );

    window.addEventListener(
        "keyup",
        (event) => {
            key_handler(event.keyCode, false);
            event.preventDefault();
        },
        false
    );

    pixi.ticker.add(delta => update(delta, performance.now()));

    select_scene(main_scene);
}

let current_scene = null;
let back_scene = null;

function select_scene(scene, params) {
    if(current_scene !== null) {
        current_scene.visible = false;
    }
    scene.visible = true;
    current_scene = scene;

    update = scene.update;
    key_handler = scene.key_handler;
    scene.select(params);
}

function popup_scene(scene, params) {
    back_scene = current_scene;
    current_scene = scene;

    scene.visible = true;

    update = scene.update;
    key_handler = scene.key_handler;
    scene.select(params);
}
