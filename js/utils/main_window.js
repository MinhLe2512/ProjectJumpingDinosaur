let app, player, jumpAt, background;
let keys = {};

let gravity = 1, direction = -1;
let power = 10;

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


let jumping = false;

function playerJump() {  
    if (jumping) return;
    jumping = true;
  
    let time = 0;
  
    const tick = deltaMs => {
      const jumpHeight = (-gravity / 2) * Math.pow(time, 2) + power * time;
      console.log(jumpHeight)
  
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
}

window.onresize = function(){
    app.renderer.resize(window.innerWidth, window.innerHeight);
    player.x = app.view.width / 2;
    player.y = app.view.height / 2;
};

