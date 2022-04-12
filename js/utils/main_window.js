let app, player, jumpAt, background;
let keys = {};

let gravity = 1, direction = -1;
let power = 20;
let spikeSpeed = 3;
let spikes = [];
var timer = 100, range = 100;
let home_background, game_background, over;
let gameOver = false;
let playerSheet = {};
let startTime;
let text;

window.onload = function() {
    app = new PIXI.Application(
        {
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x34e5eb
        }
    );
    document.body.appendChild(app.view);

    // Declare score
    text = new PIXI.Text('0',{fill: "#fafafa", fontFamily: "Impact", align : 'center', fontSize: 32});
    text.x = 40;
    text.y = 20;    

    // Declare game over notification
    over = new PIXI.Sprite.from("images/gameover.png");
    over.anchor.set(0.5);
    over.x = window.innerWidth / 2;
    over.y = window.innerHeight / 4 + 20;

    // Declare a start button
    const textureButton = PIXI.Texture.from('./images/button.png');
    const button = new PIXI.Sprite(textureButton);
    button.anchor.set(0.5);
    button.x = window.innerWidth/2;
    button.y = window.innerHeight/2;

    button.interactive = true;
    button.buttonMode = true;
    button.on('pointerdown', onButtonDown); // click on button, the game will start

    // Start screen background
    home_background = new PIXI.Graphics();
    home_background.beginFill(0xffffff);
    home_background.drawRect(0,0,
                        window.innerWidth,
                        window.innerHeight);
    home_background.endFill();

    // Game background
    game_background = new PIXI.Graphics();
    game_background.beginFill(0x34e5eb);
    game_background.drawRect(0,0,
                        window.innerWidth,
                        window.innerHeight);
    game_background.endFill();

    home_background.addChild(button);
    app.stage.addChild(home_background);

    //Platform
    background = new PIXI.Graphics();
    background.beginFill(0xffffff);
    background.lineStyle(3, 0xcccccc, 1);
    background.drawRect(0, window.innerHeight / 2,
                        window.innerWidth,
                        window.innerHeight);
    background.endFill();

    //player = new PIXI.Sprite.from('images/ezgif-4-0c1b2d3b5e-png-24x24-sprite-png/tile000.png');
    //player.anchor.set(0.5);
    //player.scale.set(2, 2);
    //player.x = app.view.width / 2;
    //player.y = app.view.height / 2;
    

    jumpAt = app.view.height / 2;
    //Mouse click interactions
    app.view.addEventListener('click', playerJump);

    window.addEventListener("keydown", function(e) {
        keys[e.keyCode] = true;
    });
    window.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false;
    });

    //app.stage.addChild(player);
    //app.ticker.add(gameLoop);
}

function doneLoading(e) {
    createPlayerSheet();
    createPlayer();
    app.ticker.add(gameLoop);
}

function createPlayerSheet() {
    let ssheet = new PIXI.BaseTexture.from(app.loader.resources["DinoSpritesdoux"].url);
    let w = 24;
    let h = 24;
    
    playerSheet["standing"] = [
    new PIXI.Texture(ssheet, new PIXI.Rectangle(3 * w, 0, w, h))
    ];
    playerSheet["dead"] = [
    new PIXI.Texture(ssheet, new PIXI.Rectangle(16 * w, 0, w, h))
    ];
    playerSheet["running"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(4 * w, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(5 * w, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(6 * w, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(7 * w, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(8 * w, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(9 * w, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(10 * w, 0, w, h))
    ];
    playerSheet["jumping"] = [
        new PIXI.Texture(ssheet, new PIXI.Rectangle(17 * w, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(18 * w, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(19 * w, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(20 * w, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(21 * w, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(22 * w, 0, w, h)),
        new PIXI.Texture(ssheet, new PIXI.Rectangle(23 * w, 0, w, h))
    ];
}

function createPlayer() {
    player = new PIXI.AnimatedSprite(playerSheet.standing);
    player.anchor.set(0.5);
    player.animationSpeed = .5;
    player.loop = false;
    player.x = app.view.width / 2;
    player.y = app.view.height / 2;
    player.scale.set(2, 2);
    app.stage.addChild(player);
    player.play();
}

//function jump
let jumping = false;

function playerJump() {  
    if (jumping) return;
    jumping = true;
  
    let time = 0;
  
    const tick = deltaMs => {
      const jumpHeight = (-gravity / 2) * Math.pow(time, 2) + power * time;
    //   console.log(jumpHeight)
  
      if (jumpHeight < 0) {
        jumping = false;
        PIXI.Ticker.shared.remove(tick);
        player.y = jumpAt;
        return;
      }
      
      if (!player.playing) {
        player.textures = playerSheet.jumping;
        player.play();
      }
      
      player.y = jumpAt + (jumpHeight * direction);
      time += deltaMs;
    }
  
    PIXI.Ticker.shared.add(tick);
}

function gameLoop() {
    if (!player.playing) {
        player.textures = playerSheet.running;
        player.play();
    }
    if (keys[32] == true) {
        playerJump();
    }
    timer--;
    if (timer <= 0) {
        timer = Math.floor(Math.random() * 51) + range;
        let spike = createSpikes();
        spikes.push(spike);

        // console.log(rectIntersects(player, spike));

        if (spikeSpeed <= 10) {
            spikeSpeed += 0.1;
            spikeSpeed.toFixed(2);
        }
        if (range >= 20)
            range -= 1;
    }
    let milliSeconds = new Date() - startTime;
    //console.log(Math.round(milliSeconds/1000) + " seconds");
    text.text = 'Score: ' + (Math.round(milliSeconds/1000 * spikeSpeed/4)).toString();
    moveSpike();
    
}

function createSpikes() {
    var val = Math.floor(Math.random() * 3) + 1;
    let spike;
    switch(val) {
        case 1:
            spike = new PIXI.Sprite.from("images/cactus1.png");
            break;
        case 2:
            spike = new PIXI.Sprite.from("images/cactus2.png");
            break;
        case 3:
            spike = new PIXI.Sprite.from("images/cactus3.png");
            break;
    }
    spike.anchor.set(0.5);
    spike.scale.set(0.2, 0.2);
    spike.x = window.innerWidth;
    spike.y = window.innerHeight / 2;
    spike.speed = spikeSpeed;

    app.stage.addChild(spike);
    
    return spike;
}

function moveSpike() {
    for (let i = 0; i < spikes.length; i++) {
        spikes[i].position.x -= spikes[i].speed * app.ticker.deltaTime;

        if (rectIntersects(player, spikes[i])) {
            
            app.stage.addChild(over);
            
            player.textures = playerSheet.dead;

            player.play();
            app.ticker.stop();
        }

        if (spikes[i].position.x < 0) {
            spikes[i].dead = true;
            app.stage.removeChild(spikes[i]);
            spikes.splice(i, 1);
        }

    }
}

function rectIntersects(a, b) {
    let aBox = a.getBounds();
    let bBox = b.getBounds();
    
    //console.log(aBox.width);
    //console.log(bBox.width);
    aBox.width -= 10;
    aBox.height -= 20;
    bBox.height -= 10;
    bBox.width -= 10;
    return (aBox.x + aBox.width > bBox.x && 
            aBox.x < bBox.x + bBox.width &&
            aBox.y + aBox.height > bBox.y &&
            aBox.y < bBox.y + bBox.height);
}
window.onresize = function(){
    app.renderer.resize(window.innerWidth, window.innerHeight);
    player.x = app.view.width / 2;
    player.y = app.view.height / 2;
    
};

// Calling needed functions
function onButtonDown() {
    startTime = new Date();
    this.isdown = true;
    app.stage.addChild(game_background);
    app.stage.addChild(background);
    app.loader.add("DinoSpritesdoux", "images/dinoCharactersVersion1.1/sheets/DinoSprites - doux.png");
    app.loader.load(doneLoading);
    app.stage.addChild(text);
    this.interactive = false;
}
