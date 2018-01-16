function GameViewer(config)
{
    console.log("In GameViewer Constructor");
    this.config = config;
    this.gameCanvas = null;
    this.canvasArea = null;
    this.transfer = null;
    this.webGL = null;
    this.sceneDone = false;
    this.gameOver = false;

    this.maps = [];
    this.currentMapIndex = 0;

    this.backgroundColor = new Color(0.05, 0.0, 0.125, 1);

    this.initViewer();
}
GameViewer.prototype.onMouseEvent = function (event) {
    console.log("In GameViewer MouseEvent");

}
GameViewer.prototype.onKeyBoardEvent = function (event) {
    console.log("In GameViewer KeyBoardEvent");
    if(event.which === 27){
        console.log("Esc");
        this.doGameOver();
        this.gameOver = true;
    }

}
GameViewer.prototype.isSceneDone = function(){
    return this.sceneDone;
}
GameViewer.prototype.doScene = function () {
    //Some process between two scenes

    this.prototype.setSceneState(false);
}
GameViewer.prototype.isGameOver = function(){
    return this.gameOver;
}
GameViewer.prototype.setSceneState = function(state){
    this.sceneDone = state;
}
GameViewer.prototype.doGameOver = function(){
    this.gameOver = true;
    console.log("gameOver:",this.gameOver);
}
GameViewer.prototype.collisionDetection = function(){
    if (this.isValidMapIndex(this.currentMapIndex))
    {
        this.maps[this.currentMapIndex].processObjectHits();
    }
}
GameViewer.prototype.updateFrame = function(){
    //update objects actions here and return true

    return (true);
}


GameViewer.prototype.initViewer = function()
{
    this.gameCanvas = $("gameCanvas");
    this.gameCanvas.width = window.screen.availWidth * 0.98;
    this.gameCanvas.height = window.screen.availHeight * 0.98;

    var left = getElementLeft(this.gameCanvas);
    var top = getElementTop(this.gameCanvas);
    var width = this.gameCanvas.width;
    var height = this.gameCanvas.height;

    this.canvasArea = new Rect(left, top, width, height);
    // Transfer from screen to WebGL.
    this.transfer = new Rect(-2 * left / width - 1,
        2 * top / height + 1,
        2 / width,
        -2 / height);

    this.webGL = new WebGL(this.gameCanvas);

    this.webGL.setViewport(0, 0);
}

GameViewer.prototype.viewAt = function(x, y)
{
    this.webGL.setViewport(x, y);
}

GameViewer.prototype.scroll = function(offsetX, offsetY)
{
    this.webGL.scroll(offsetX, offsetY);
}

GameViewer.prototype.transferCoordinatesToGL = function()
{
    var maps = this.maps;

    var xShift = this.transfer.left;
    var yShift = this.transfer.top;
    var stretch = max(this.transfer.width, this.transfer.height);

    // For each map
    for (let i = 0; i < maps.length; i++)
    {
        // For each layer
        for (let j = 0; j < GameMap.LAYERS_COUNT; j++)
        {
            // For each object
            for (let k = 0; k < maps[i][j].length; k++)
            {
                maps[i][j][k].bounding.transfer(xShift, yShift, stretch, stretch);
            }
        }
    }
}

GameViewer.prototype.onRender = function()
{
    this.renderBackground();

    if (this.isValidMapIndex(this.currentMapIndex))
    {
        this.maps[this.currentMapIndex].onRender(this.webGL);
    }
}

GameViewer.prototype.renderBackground = function()
{
    this.webGL.clearScreen(this.backgroundColor);
}

GameViewer.prototype.isMapListEmpty = function()
{
    return this.maps.length == 0;
}

GameViewer.prototype.getMapsCount = function()
{
    return this.maps.length;
}

GameViewer.prototype.isValidMapIndex = function(index)
{
    return (index >= 0 && index < this.maps.length);
}

GameViewer.prototype.lookupMapIndex = function(mapID)
{
    for (let i = 0; i < this.maps.length; i++)
    {
        if (this.maps[i].id == mapID)
        {
            return i;
        }
    }
    return -1;
}

GameViewer.prototype.getMapByIndex = function(index)
{
    if (this.isValidMapIndex(index))
    {
        return this.maps[index];
    }
    else
    {
        return null;
    }
}

GameViewer.prototype.getMapByID = function(mapID)
{
    var index = this.lookupMapIndex(mapID);
    return this.isValidMapIndex(index) ? this.maps[index] : null;
}

GameViewer.prototype.getCurrentMap = function()
{
    if (this.isValidMapIndex(this.currentMapIndex))
    {
        return this.maps[this.currentMapIndex];
    }
    else
    {
        return null;
    }
}

GameViewer.prototype.setCurrentMap = function(indexOrID)
{
    var i = -1;

    if (typeof indexOrID === "number")
    {
        i = indexOrID;
    }
    else if (typeof indexOrID === "string")
    {
        i = this.lookupMapIndex(indexOrID);
    }

    if (this.isValidMapIndex(i))
    {
        this.currentMapIndex = i;
    }
    //Maybe there needs to do some render after alter the current map
    return i;
}

GameViewer.prototype.addMap = function(mapID)
{
    var gameMap = new GameMap(this.config);
    gameMap.load(mapID);
    this.maps.push(gameMap);
}

GameViewer.prototype.addMaps = function(mapIDArray)
{
    for (let i = 0; i < mapIDArray.length; i++)
    {
        this.addMap(mapIDArray[i]);
    }
}

GameViewer.prototype.removeMap = function(from, to)
{
    return this.maps.remove(from, to);
}

GameViewer.prototype.clearAllMaps = function()
{
    this.maps = [];
}

// end of GameViewer.js