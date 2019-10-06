function Main_scene(pixi) {
    let scene = new Container();

    let sheet = null;
    scene.person = null;
    scene.walking_person = null;
    scene.turning_person = null;

    PIXI.loader
        .add("assets/spritesheet.json")
        .load(() => {
            sheet = PIXI.loader.resources["assets/spritesheet.json"].spritesheet;

            console.log(sheet);

            let background = new PIXI.Sprite(sheet.textures["city_0_back.png"]);
            background.width *= 1.5;
            background.height *= 1.5;

            scene.addChild(background);

            scene.walking_person = new PIXI.extras.AnimatedSprite(
                sheet.data.animations["person_walk"].map(x => PIXI.Texture.from(x))
            );
            // scene.person.play();

            scene.walking_person.x = 213 * 1.5;
            scene.walking_person.y = 270 * 1.5;
            scene.walking_person.width *= 2.0 * 1.5;
            scene.walking_person.height *= 1.5 * 1.5;

            scene.walking_person.vx = 0.0;
            scene.person.vturn = 0.0;
            scene.person.turn = 0.0;

            scene.addChild(scene.person);
        });

    const margin_left = 30;

    /*
    let background = new Graphics()
        .beginFill(0x000000)
        .drawRect(0, 0, pixi.screen.width, pixi.screen.height)
        .endFill();
    */

    

    scene.update = (delta, now) => {
        if(scene.person !== null) {
            scene.person.x += scene.person.vx * (1.0 + Math.sin(now * scene.person.animationSpeed * 4)) * delta;

            scene.person.animationSpeed = scene.person.vx * 0.15;

            if(scene.person.vturn != 0) {
                if(scene.person.turn <= 1.0 && scene.person.turn >= -1.0) {
                    scene.person.turn += scene.person.vturn * delta;
                }
            } else {

            }
        }
    };

    scene.cmd_cb = null;

    scene.key_handler = (key, isPress) => {
        if(isPress && (key === 39 || key === 68)) {
            scene.person.vx = 1.2;
        }
        if(isPress && (key === 37 || key === 65)) {
            scene.person.vx = -1.2;
        }
        if(!isPress && (key === 39 || key === 37 || key === 68 || key === 65)) {
            scene.person.vx = 0;
        }
    };

    scene.select = () => {

    };

    return scene;
}