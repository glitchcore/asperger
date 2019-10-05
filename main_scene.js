function Main_scene(pixi) {
    let scene = new Container();

    let sheet = null;
    PIXI.loader
        .add("assets/spritesheet.json")
        .load(() => {
            sheet = PIXI.loader.resources["assets/spritesheet.json"].spritesheet;

            console.log(sheet);

            let background = new PIXI.Sprite(sheet.textures["city_0_back.png"]);
            scene.addChild(background);

            let person = new PIXI.extras.AnimatedSprite(
                sheet.data.animations["person_turn"].map(x => PIXI.Texture.from(x))
            );
            person.animationSpeed = 0.167; 
            person.play();

            person.x = 213;
            person.y = 270;
            person.width *= 1.5;
            person.height *= 1.5;
            scene.addChild(person);
        });

    const margin_left = 30;

    /*
    let background = new Graphics()
        .beginFill(0x000000)
        .drawRect(0, 0, pixi.screen.width, pixi.screen.height)
        .endFill();
    */

    

    scene.update = (delta, now) => {

    };

    scene.cmd_cb = null;

    scene.key_handler = (key, isPress) => {

    };

    scene.select = () => {

    };

    return scene;
}