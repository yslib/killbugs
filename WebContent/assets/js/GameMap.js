/***
* GameMap.js
* Version 1.2.1
* Last Modified 2018/01/16
*/

function GameMap(config)
{
	GameObject.call(this, config);
	
	this.mapReference = this;
	
	this.bounding = Rect.makeRect();
	this.view = Rect.makeRect();
	
	this.id = "";
	this.name = "";
	
	this.objects = null;
	
	this.resetMap();
}

GameMap.prototype = new GameObject();
GameMap.prototype.constructor = GameMap;

GameMap.UNKNOWN = -1;
GameMap.MAP = 0;
GameMap.HIDDEN = 1;
GameMap.GROUND = 2;
GameMap.MIDDLE = 3;
GameMap.UPPER = 4;
GameMap.FLOWING = 5;
GameMap.LAYERS_COUNT = 6;

GameMap.prototype.getBoundingBox = function()
{
	return this.bounding;
}

GameMap.prototype.testHit = function(object)
{
	if (GameMap.isValidMapObject(object))
	{
		var box = object.getBoundingBox();
		
		return !this.bounding.contains(box);
	}
	else
	{
		return false;
	}
}

GameMap.prototype.onHit = function(object) {}

GameMap.prototype.onRender = function(webgl)
{
	// render(this.texture);
	
	// Ignore hidden objects.
	for (let i = GameMap.HIDDEN + 1; i < GameMap.LAYERS_COUNT; i++)
	{
		for (let j = 0; j < this.objects[i].length; j++)
		{
			this.objects[i][j].onRender(webgl);
			webgl.drawPrimitive(this.objects[i][j]);
		}
	}
}

GameMap.prototype.updateState = function() {}

GameMap.isValidMapObject = function(object)
{
	return object instanceof GameObject && !(object instanceof GameMap);
}

GameMap.isValidLayer = function(layer)
{
	return layer >= 0 && layer < GameMap.LAYERS_COUNT;
}

GameMap.makeMapXPath = function(mapID)
{
	return "/config/maps/map[@id='" + mapID + "']";
}

GameMap.makeObjectsXPath = function(mapID, layer)
{
	return "/config/maps/map[@id='" + mapID
		+ "']/objects/group[@layer='" + layer + "']";
}

GameMap.prototype.load = function(mapID)
{
	var mapNode = null;
	
	var gameObject = null;
	var objectClass = "";
	var objectLayer = GameMap.UNKNOWN;
	var objectType = "";
	
	var layerNames = ["map", "hidden", "ground", "middle", "upper", "flowing"];
	var xPaths = [];
	
	var allGroups = [];
	var rawObjects= null;
	
	var x = 0;
	var y = 0;
	var width = 0;
	var height = 0;
	var radius = 0;
	
	this.resetMap();
	this.id = mapID;
	mapNode = this.config.getNodeByXPath(GameMap.makeMapXPath(mapID));
	if (mapNode != null)
	{
		this.name = mapNode.getAttribute("name").valueOf();
	}
	
	for (let i = 0; i < layerNames.length; i++)
	{
		xPath = GameMap.makeObjectsXPath(mapID, layerNames[i]);
		allGroups[i] = this.config.getNodesByXPath(xPath);
	}
	
	for (let layer = 0; layer < GameMap.LAYERS_COUNT; layer++)
	{
		for (let group = 0; group < allGroups[layer].length; group++)
		{
			try
			{
				objectLayer = eval("GameMap."
					+ allGroups[layer][group].getAttribute("layer").toUpperCase().valueOf());
				objectClass = allGroups[layer][group].getAttribute("class").valueOf();
			}
			catch (e)
			{
				console.log(e.message);
				continue;
			}
			
			if (GameMap.isValidLayer(objectLayer))
			{
				rawObjects = allGroups[layer][group].children;
				for (let k = 0; k < rawObjects.length; k++)
				{
					try
					{
						gameObject = eval("new " + objectClass + "(this.config)");
						
						if (!GameMap.isValidMapObject(gameObject))
						{
							continue;
						}
						
						objectType = rawObjects[k].getAttribute("type")
							.toLowerCase().valueOf();
						
						if (objectType == "rect")
						{
							x = parseInt(rawObjects[k].getAttribute("left"), 10);
							y = parseInt(rawObjects[k].getAttribute("top"), 10);
							
							width = parseInt(rawObjects[k].getAttribute("width"), 10);
							height = parseInt(rawObjects[k].getAttribute("height"), 10);
							
							gameObject.bounding = new Rect(x, y, width, height);
							gameObject.mapReference = this;
						}
						else if (objectType == "circle")
						{
							x = parseInt(rawObjects[k].getAttribute("centerX"), 10);
							y = parseInt(rawObjects[k].getAttribute("centerY"), 10);
							
							radius = parseInt(rawObjects[k].getAttribute("radius"), 10);
							
							gameObject.bounding = new Circle(new Point(x, y), radius);
							gameObject.mapReference = this;
						}
						else
						{
							continue;
						}
						
						this.addObject(gameObject, objectLayer);
					}
					catch (e)
					{
						console.log(e.message);
						continue;
					}
				}
			}			
		}
	}
	
	try
	{
		if (this.objects.length > 0 && this.objects[GameMap.MAP].length > 1)
		{
			this.bounding = this.objects[GameMap.MAP][0].bounding;
			this.view = this.objects[GameMap.MAP][1].bounding;
		}
	}
	catch (e)
	{
		console.log(e.message);
	}
	
	this.onLoad();
}

GameMap.prototype.onLoad = function()
{
	
}

GameMap.prototype.setView = function(x, y, width, height)
{
	if (x && y && width && height)
	{
		this.view.setRect(x, y, width, height);
	}
}

GameMap.prototype.setViewSize = function(width, height)
{
	this.setView(this.view.x, this.view.y, width, height);
}

GameMap.prototype.setViewTopLeft = function(x, y)
{
	this.setView(x, y, this.view.width, this.view.height);
}

GameMap.prototype.scrollView = function(offsetX, offsetY)
{
	this.setView
	(
		this.view.x + offsetX,
		this.view.y + offsetY,
		this.view.width,
		this.view.height
	);
}

GameMap.prototype.viewAt = function(point)
{
	if (point instanceof Point)
	{
		this.setViewTopLeft
		(
			point.x - this.view.width / 2,
			point.y - this.view.height / 2
		);
	}
}

GameMap.prototype.indexOfObject = function(object, layer)
{
	if (GameMap.isValidMapObject(object) && GameMap.isValidLayer(layer))
	{
		for (let i = 0; i < this.objects[layer].length; i++)
		{
			if (object == this.objects[layer][i])
			{
				return i;
			}
		}
	}
	return -1;
}

GameMap.prototype.addObject = function(object, layer)
{
	if (GameMap.isValidMapObject(object) && GameMap.isValidLayer(layer))
	{
		this.objects[layer].push(object);
	}
}

GameMap.prototype.removeObject = function(object, layer)
{
	if (GameMap.isValidMapObject(object) && GameMap.isValidLayer(layer))
	{
		var index = this.indexOfObject(object, layer);
		if (index >= 0)
		{
			this.objects[layer].remove(index);
		}
	}
}

GameMap.prototype.removeObjectByIndex = function(layer, index)
{
	if (GameMap.isValidLayer(layer))
	{
		this.objects.remove(index);
	}
}

GameMap.prototype.processObjectHits = function()
{
	if (this.objects.length > GameMap.FLOWING)
	{
		var flowingObjects = this.objects[GameMap.FLOWING];
		var flowingCount = flowingObjects.length;
		
		var passiveObjects = null;
		var passiveCount = 0;
		
		var removeFlag1 = false;
		var removeFlag2 = false;
		
		try
		{
			// Since still objects never hit others, let the moving ones hit them.
			// Additional, ignore hidden and ground objects.
			for (let layer = GameMap.MAP; layer < GameMap.LAYERS_COUNT; layer++)
			{
				if (layer == GameMap.HIDDEN || layer == GameMap.GROUND)
				{
					continue;
				}
				passiveObjects = this.objects[layer];
				passiveCount = passiveObjects.length;
				
				for (let j = 0; j < passiveCount; j++)
				{
					if (passiveObjects[j] === undefined)
					{
						continue;
					}
					
					for (let k = 0; k < flowingCount; k++)
					{
						if (flowingObjects[k] === undefined)
						{
							continue;
						}
						
						if (flowingObjects[k].testHit(passiveObjects[j]))
						{
							removeFlag1 = flowingObjects[k].onHit(passiveObjects[j]);
							removeFlag2 = passiveObjects[j].onHit(flowingObjects[k]);
							
							// Set deleted objects to undefined instead of removing
							// them directly to maintain the array length.
							if (removeFlag1)
							{
								flowingObjects[k].mapReference = null;
								flowingObjects[k] = undefined;
							}
							
							if (removeFlag2)
							{
								passiveObjects[j].mapReference = null;
								passiveObjects[j] = undefined;
							}
						}
					}
				}
			}
		}
		catch (e)
		{
			console.log(e.message);
		}
	}
}

GameMap.prototype.updateObjectStates = function()
{
	for (let layer = GameMap.Map; layer < this.objects.length; layer++)
	{
		for (let j = 0; j < this.objects[layer].length; j++)
		{
			if (this.objects[layer][j])
			{
				this.objects[layer][j].updateState();
			}
		}
	}
}

GameMap.prototype.clearDeletedObjects = function()
{
	var objectsArray = null;
	var objectsCount = 0;
	
	// Clear deleted(undefined) objects.
	// Since the map and the hidden objects are never deleted,ignore them here.
	for (let layer = GameMap.GROUND; layer < GameMap.LAYERS_COUNT; layer++)
	{
		objectsArray = this.objects[layer];
		objectsCount = objectsArray.length;
		
		for (let i = 0; i < objectsCount; i++)
		{
			if (objectsArray[i] === undefined)
			{
				objectsArray.remove(i);
				objectsCount = objectsArray.length;
				i--;
			}
		}
	}
}

GameMap.prototype.clearAllObjects = function()
{
	this.objects = [];
	for (let i = 0; i < GameMap.LAYERS_COUNT; i++)
	{
		this.objects.push([]);
	}
}

GameMap.prototype.resetMap = function()
{
	this.bounding = null;
	this.id = "";
	this.name = "";
	this.clearAllObjects();
}

// end of GameMap.js

