let app, player, jumpAt, background;
let keys = {};

let gravity = 1, direction = -1;
let power = 15;
let spikeSpeed = 3;
let spikes = [];
var timer = 100;

window.onload = function() {
    app = new PIXI.Application(
        {
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x34e5eb
        }
    );
    document.body.appendChild(app.view);

    //Platform
    background = new PIXI.Graphics();
    background.beginFill(0xffffff);
    background.lineStyle(3, 0xcccccc, 1);
    background.drawRect(0, window.innerHeight / 2,
                        window.innerWidth,
                        window.innerHeight);
    background.endFill();
    app.stage.addChild(background);

    player = new PIXI.Sprite.from('images/ezgif-4-0c1b2d3b5e-png-24x24-sprite-png/tile000.png');
    player.anchor.set(0.5);
    player.scale.set(2, 2);
    player.x = app.view.width / 2;
    player.y = app.view.height / 2;


    jumpAt = player.y;
    //Mouse click interactions
    app.view.addEventListener('click', playerJump);

    window.addEventListener("keydown", function(e) {
        keys[e.keyCode] = true;
    });
    window.addEventListener("keyup", function(e) {
        keys[e.keyCode] = false;
    });

    app.stage.addChild(player);
    app.ticker.add(gameLoop);
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
  
      player.y = jumpAt + (jumpHeight * direction);
      time += deltaMs;
    }
  
    PIXI.Ticker.shared.add(tick);
}

function gameLoop() {
    if (keys[32] == true) {
        playerJump();
    }
    timer--;
    if (timer <= 0) {
        timer = Math.floor(Math.random() * 101) + 100;
        let spike = createSpikes();
        spikes.push(spike);
        if (spikeSpeed <= 5)
            spikeSpeed += 0.05;
    }
    console.log(spikes.length);
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

        if (spikes[i].position.x < 0) {
            spikes[i].dead = true;
            app.stage.removeChild(spikes[i]);
            spikes.splice(i, 1);
        }
    }
}
window.onresize = function(){
    app.renderer.resize(window.innerWidth, window.innerHeight);
    player.x = app.view.width / 2;
    player.y = app.view.height / 2;
    
};

