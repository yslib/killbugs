/***
* GameViewer.js
* Version 1.2.1
* Last Modified 2018/01/16
*/

function GameViewer(config)
{
	this.config = config;
	
	// Canvas element
	this.gameCanvas = null;
	// Canvas location on web page
	this.canvasArea = Rect.makeRect();
	
	this.webGL = null;
	
	this.maps = [];
	this.currentMapIndex = 0;
	
	this.backgroundColor = new Color(0.05, 0.0, 0.125, 1);
	this.backgroundImageFile = "";
	this.backgroundImage = new Image();
	
	this.initViewer();
}

GameViewer.prototype.initViewer = function()
{
	this.gameCanvas = $("gameCanvas");
	this.gameCanvas.width = window.screen.availWidth * 0.98;
	this.gameCanvas.height = window.screen.availHeight * 0.84;
	
	var left = getElementLeft(this.gameCanvas);
	var top = getElementTop(this.gameCanvas);
	var width = this.gameCanvas.width;
	var height = this.gameCanvas.height;
	
	this.canvasArea.setRect(left, top, width, height);
	
	this.webGL = new WebGL(this.gameCanvas);
    this.webGL.setViewport(0, 0, width, height);
	
	this.backgroundImageFile = "assets/images/ground.png";
	this.backgroundImage.src = this.backgroundImageFile;
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
	this.webGL.drawPrimitive(this.getCurrentMap(), this.backgroundImage);
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

GameViewer.prototype.isSceneDone = function()
{
    return this.sceneDone;
}

GameViewer.prototype.doScene = function()
{
    //Some process between two scenes

    this.prototype.setSceneState(false);
}

GameViewer.prototype.isGameOver = function()
{
    return this.gameOver;
}

GameViewer.prototype.setSceneState = function(state)
{
    this.sceneDone = state;
}

GameViewer.prototype.doGameOver = function()
{
    this.gameOver = true;
    console.log("gameOver:",this.gameOver);
}

GameViewer.prototype.collisionDetection = function()
{
    if (this.isValidMapIndex(this.currentMapIndex))
    {
        this.maps[this.currentMapIndex].processObjectHits();
    }
}

GameViewer.prototype.updateFrame = function()
{
    //update objects actions here and return true

    return (true);
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

