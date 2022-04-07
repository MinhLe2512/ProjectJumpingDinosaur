let app;

window.onload = function() {
    app = new PIXI.Application(
        {
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x34e5eb
        }
    );
    document.body.appendChild(app.view)
}

window.onresize = function(){
    app.renderer.resize(window.innerWidth, window.innerHeight);
}