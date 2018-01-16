
/***
 * Main.js
 ***/

function Queue(){
    this.queue = [];
}
Queue.prototype.push = function (item) {
    this.queue.push(item);
}
Queue.prototype.front = function(){
    if(this.queue.length > 0)
        return this.queue[0];
    else
        return null;
}
Queue.prototype.pop = function(){
    this.queue.shift();
}
Queue.prototype.size = function () {
    return this.queue.length;
}

window.onload = Main;

function Main(event)
{
    this.requestAnimationFrameId = 0;
    this.frameCount = 0;

    Main.prototype.init(event);

    console.log("In Main");

    this.MessageQueue = new Queue();

    this.plotManager = new PlotManager();

    this.gameViewer = new GameViewer(800, 600);
    //
    var config = new Configuration("assets/config/scenes.xml");
    console.log(config.xmlDoc);
    //
    var block = new Block(config);
    var round = new Round(config);

    console.log(block.bounding);
    console.log(round.bounding);

    //Enter the Game Loop
    this.requestAnimationFrameId = requestAnimationFrame(Main.prototype.gameLoop);
}
Main.prototype.gameLoop = function () {
    //

    console.log("In Game Loop:%d",this.frameCount);
    this.frameCount++;
    if(this.MessageQueue.size() !== 0){
        while(this.MessageQueue.size() !== 0){
            var e = this.MessageQueue.front();
            if(e instanceof MouseEvent)
                this.gameViewer.onMouseEvent(e);
            else if(e instanceof KeyboardEvent)
                this.gameViewer.onKeyBoardEvent(e);
            this.MessageQueue.pop();
        }
    }
    if(this.gameViewer.updateFrame() === false){
        Main.prototype.exit();
    }
    this.gameViewer.collisionDetection();
    if(this.gameViewer.onRender() === false){
        Main.prototype.exit();
    }
    if(this.gameViewer.isSceneDone() === true){
        this.gameViewer.doScene();
    }
    console.log(this.gameViewer.isGameOver());
    if(this.gameViewer.isGameOver() === true){
        console.log("isGameOver === true");
        Main.prototype.exit();
    }else{
        this.requestAnimationFrameId = requestAnimationFrame(Main.prototype.gameLoop);
    }
}
Main.prototype.init = function(event)
{
    console.log("init");
    window.onmousedown = Main.prototype.onMouseDown;
    window.onkeydown = Main.prototype.onKeyDown;
}

Main.prototype.cleanUp = function()
{
    console.log("clean up");
    window.onmousedown = null;
    window.onkeydown = null;
}
Main.prototype.exit = function(){
    console.log("In Exit Function");
    cancelAnimationFrame(this.requestAnimationFrameId);
    Main.prototype.cleanUp();

}
Main.prototype.onMouseDown = function(event)
{
    //console.log("on mouse down");
    //console.log(event instanceof MouseEvent);
    this.MessageQueue.push(event);
}

Main.prototype.onLeftButton = function(event)
{
    console.log("on left button ");
    //this.MessageQueue.push(event);
}

Main.prototype.onRightButton = function(event)
{
    console.log("on right button ");
    //this.MessageQueue.push(event);
}

Main.prototype.onKeyDown = function(event)
{
    this.MessageQueue.push(event);
}

// end of Main.js