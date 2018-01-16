// JavaScript Document
//
// Main Engine
//

/***
* Utility.js
* Version 1.2.0
* Last Modified 2018/01/08
***/

function $(id)
{
	return document.getElementById(id);
}

function $tag(name)
{
	return document.getElementsByTagName(name);
}

function getElementLeft(element)
{
	var actualLeft = element.offsetLeft;
	var current = element.offsetParent;
	while (current !== null)
	{
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
	}
	return actualLeft;
}

function getElementTop(element)
{
	var actualTop = element.offsetTop;
	var current = element.offsetParent;
	while (current !== null)
	{
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}
	return actualTop;
}

function _p(Class)
{
	return Class.prototype;
}

function listMembersOf(object)
{
	for (member in object)
	{
		console.log(member + ":" + object[member]);
	}
}

function areEqual(x, y)
{
	// If both x and y are null or undefined and exactly the same
	if (x === y)
	{
		return true; 
	}
	
	// If they are not strictly equal, they both need to be Objects
	if ( ! (x instanceof Object) || ! (y instanceof Object))
	{
		return false;
	}
	
	// They must have the exact same prototype chain,the closest we can do is
	// testing the constructor.
	if (x.constructor !== y.constructor)
	{
		return false;
	}
	
	for (var p in x)
	{ 
		// Inherited properties were tested using x.constructor === y.constructor
		if (x.hasOwnProperty(p))
		{
			// Allows comparing x[p] and y[p] when set to undefined 
			if ( ! y.hasOwnProperty(p))
			{
				return false;
			}
			
			// If they have the same strict value or identity then they are equal
			if (x[p] === y[p])
			{
				continue;
			}
			
			// Numbers, Strings, Functions, Booleans must be strictly equal
			if (typeof(x[p]) !== "object")
			{
				return false;
			}
			
			// Objects and Arrays must be tested recursively
			if ( ! Object.equals(x[p], y[p]))
			{
				return false;
			}
		}
	}
	
	for (p in y)
	{
		// allows x[p] to be set to undefined
		if (y.hasOwnProperty(p) && ! x.hasOwnProperty(p))
		{
			return false;
		} 
	}
	
	return true; 
};

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to)
{
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
}

// end of Utility.js


/***
* Geometry.js
* Version 1.2.5
* Last Modified 2018/01/15
***/

function normalizeDegree(degree)
{
	var angle = degree;
	var sign = degree > 0 ? 1 : -1;
	while (Math.abs(angle) > 180)
	{
		angle -= 360 * sign;
	}
	return angle;
}

function normalizeRadian(radian)
{
	var angle = radian;
	var sign = radian > 0 ? 1 : -1;
	var twoPI = Math.PI * 2;
	while (Math.abs(angle) > Math.PI)
	{
		angle -= twoPI * sign;
	}
	return angle;
}

function degree2Radian(degree)
{
	return degree * (Math.PI / 180);
}

function radian2Degree(radian)
{
	return radian * (180 / Math.PI);
}

function Shape()
{
	
}

Shape.prototype.deepCopy = function(shape) {}

Shape.prototype.transfer = function(xShift, yShift, xStretch, yStretch) {}

function Point(x, y)
{
	Shape.call(this);
	
	this.setPoint(x, y);
}

Point.prototype = new Shape();
Point.prototype.constructor = Point;

Point.prototype.setPoint = function(x, y)
{
	this.x = x;
	this.y = y;
}

Point.makePoint = function()
{
	return new Point(0, 0);
}

Point.prototype.deepCopy = function(point)
{
	if (point instanceof Point)
	{
		this.setPoint(point.x, point.y);
	}
}

Point.prototype.add = function(point)
{
	return new Point(this.x + point.x, this.y + point.y);
}

Point.prototype.sub = function(point)
{
	return new Point(this.x - point.x, this.y - point.y);
}

Point.prototype.times = function(k)
{
	return new Point(k * this.x, k * this.y);
}

Point.prototype.dot = function(point)
{
	return this.x * point.x + this.y * point.y;
}

Point.prototype.getLength = function()
{
	return Math.sqrt(this.x * this.x + this.y * this.y);
}

Point.prototype.normalize = function()
{
	var length = this.getLength();
	if (length > 0)
	{
		this.x /= length;
		this.y /= length;
	}
}

Point.prototype.distanceWith = function(point)
{
	var offsetX = point.x - this.x;
	var offsetY = point.y - this.y;
	return Math.sqrt(offsetX * offsetX + offsetY * offsetY);
}

Point.prototype.manhattanDistanceWith = function(point)
{
	return Math.abs(point.x - this.x) + Math.abs(point.y - this.y);
}

Point.prototype.angleWith = function(point)
{
	return Math.acos(this.dot(point) / this.getLength() / point.getLength());
}

Point.prototype.transfer = function(xShift, yShift, xStretch, yStretch)
{
	this.x = xStretch * this.x + xShift;
	this.y = yStretch * this.y + yShift;
}

function Rect(left, top, width, height)
{
	Shape.call(this);
	
	this.setRect(left, top, width, height);
}

Rect.prototype = new Shape();
Rect.prototype.constructor = Rect;

Rect.prototype.setRect = function(left, top, width, height)
{
	this.left = left;
	this.top = top;
	this.width = width;
	this.height = height;
}

Rect.makeRect = function()
{
	return new Rect(0, 0, 0, 0);
}

Rect.prototype.deepCopy = function(rect)
{
	if (rect instanceof Rect)
	{
		this.setRect(rect.left, rect.top, rect.width, rect.height);
	}
}

Rect.prototype.topLeft = function()
{
	return new Point(this.left, this.top);
}

Rect.prototype.topRight = function()
{
	return new Point(this.left + this.width, this.top);
}

Rect.prototype.bottomLeft = function()
{
	return new Point(this.left, this.top + this.height);
}

Rect.prototype.bottomRight = function()
{
	return new Point(this.left + this.width, this.top + this.height);
}

Rect.prototype.contains = function(shape)
{
	if (shape instanceof Point)
	{
		var offsetX = point.x - this.left;
		var offsetY = point.y - this.top;
		return (offsetX >= 0 && offsetX <= this.width
			&& offsetY >= 0 && offsetY <= this.height);
	}
	else if (shape instanceof Rect)
	{
		return this.contains(shape.topLeft())
			&& this.contains(shape.topRight())
			&& this.contains(shape.bottomLeft())
			&& this.contains(shape.bottomRight());
	}
	else
	{
		return false;
	}
}

Rect.prototype.intersects = function(rect)
{
	return this.contains(rect.topLeft())
		|| this.contains(rect.topRight())
		|| this.contains(rect.bottomLeft())
		|| this.contains(rect.bottomRight());
}

Rect.prototype.transfer = function(xShift, yShift, xStretch, yStretch)
{
	this.left = xStretch * this.left + xShift;
	this.top = yStretch * this.top + yShift;
	this.width *= xStretch;
	this.height *= yStretch;
}

function Circle(center, radius)
{
	Shape.call(this);
	
	this.setCircle(center, radius);
}

Circle.prototype = new Shape();
Circle.prototype.constructor = Circle;

Circle.prototype.setCircle = function(center, radius)
{
	this.center = new Point(center.x, center.y);
	this.radius = radius;
}

Circle.makeCircle = function()
{
	return new Circle(new Point(0, 0) , 0);
}

Circle.prototype.deepCopy = function(circle)
{
	if (circle instanceof Circle)
	{
		this.setCircle(circle.center, circle.radius);
	}
}

Circle.prototype.centerDistanceWith = function(circle)
{
	return circle.center.distanceWith(this.center);
}

Circle.prototype.surfaceDistanceWith = function(circle)
{
	return this.centerDistanceWith(circle) - (this.radius + circle.radius);
}

Circle.prototype.contains = function(shape)
{
	if (shape instanceof Point)
	{
		return shape.distanceWith(this.center) <= this.radius;
	}
	else if (shape instanceof Circle)
	{
		return this.centerDistanceWith(circle) <= this.radius - shape.radius;
	}
	else
	{
		return false;
	}
}

Circle.prototype.intersects = function(circle)
{
	return circle.centerDistanceWith(this) <= circle.radius + this.radius;
}

Circle.prototype.innerBounding = function()
{
	var bounding = Rect.makeRect();
	var halfEdge = this.radius / Math.SQRT2;
	
	bounding.left = this.center.x - halfEdge;
	bounding.top = this.center.y - halfEdge;
	bounding.width = halfEdge * 2;
	bounding.height = bounding.width;
	
	return bounding;
}

Circle.prototype.outerBounding = function()
{
	var bounding = Rect.makeRect();
	
	bounding.left = this.center.x - this.radius;
	bounding.top = this.center.y - this.radius;
	bounding.width = this.radius * 2;
	bounding.height = bounding.width;
	
	return bounding;
}

Circle.prototype.transfer = function(xShift, yShift, xStretch, yStretch)
{
	this.center.transfer(xStretch, xShift, yStretch, yShift);
	this.radius *= xStretch;
}

function Direction(direction)
{
	Shape.call(this);
	
	this.setDirection(direction);
}

Direction.prototype = new Shape();
Direction.prototype.constructor = Direction;

Direction.NONE = 0x0;
Direction.NORTH = 0x1;
Direction.EAST = 0x2;
Direction.SOUTH = 0x4;
Direction.WEST = 0x8;
Direction.NORTHEAST = 0x3;
Direction.SOUTHEAST = 0x6;
Direction.NORTHWEST = 0x9;
Direction.SOUTHWEST = 0xC;

Direction.setDirection = function(direction)
{
	this.direction = direction;
	this.offset = Direction.getOffset(direction);
}

Direction.prototype.deepCopy = function(direction)
{
	if (direction instanceof Direction)
	{
		this.setDirection(direction);
	}
}

Direction.getOffset = function(direction)
{
	var offset = new Point(0, 0);
	if (typeof direction === "number")
	{
		if ((direction & Direction.NORTH) == Direction.NORTH)
		{
			offset.y -= 1;
		}
		if ((direction & Direction.EAST) == Direction.EAST)
		{
			offset.x += 1;
		}
		if ((direction & Direction.SOUTH) == Direction.SOUTH)
		{
			offset.y += 1;
		}
		if ((direction & Direction.WEST) == Direction.WEST)
		{
			offset.x -= 1;
		}
	}
	return offset;
}

Direction.prototype.transfer = function(xShift, yShift, xStretch, yStretch)
{
	this.offset.transfer(xShift, yShift, xStretch, yStretch);
}

function Color(r, g, b, a)
{
	this.setColor(r, g, b, a);
}

Color.prototype.setColor = function(r, g, b, a)
{
	this.r = r;
	this.g = g;
	this.b = b;
	this.a = a;
}

Color.prototype.deepCopy = function(color)
{
	if (color instanceof Color)
	{
		this.setColor(color.r, color.g, color.b, color.a);
	}
}

Color.makeColor = function()
{
	return new Color(0.0, 0.0, 0.0, 0.0);
}

// end of Geometry.js


/***
* Configuration.js
* Version 1.1
* Last Modified 2018/01/05
*/

function Configuration(filename)
{
	this.filename = filename;
	this.xmlDoc = this.load(filename);
	
	this.init();
}

Configuration.prototype.init = function()
{
	if (!window.ActiveXObject)
	{
		XMLDocument.prototype.selectSingleNode =
			Element.prototype.selectSingleNode = function(xpath)
			{
				var nodes = this.selectNodes(xpath);
				if ( ! nodes || nodes.length < 1 )
				{
					return null;
				}
				return nodes[0];
			}
		XMLDocument.prototype.selectNodes =
			Element.prototype.selectNodes = function(xpath)
			{
				var evaluator = new XPathEvaluator();
				var resolver = evaluator.createNSResolver
					(
						this.ownerDocument == null ?
						this.documentElement : this.ownerDocument.documentElement
					);
				var nodes = evaluator.evaluate(xpath, this, resolver, 0, null);
				var found = [];
				var node;
				
				while (node = nodes.iterateNext())
				{
					found.push(node);
				}
				
				return found;
			}
	}
}

Configuration.prototype.load = function(filename)
{
	var doc = null;
	
	try
	{
		// Internet Explorer
		doc = new ActiveXObject("Microsoft.XMLDOM");
		doc.async = false;
	}
	catch (e)
	{
		try
		{
			// Firefox, Mozilla, Opera, etc. 
			doc = document.implementation.createDocument("", "", null);
			doc.async = false;
			doc.open(filename);
		}
		catch (e)
		{
			try
			{
				// Google Chrome
				var xmlhttp = new window.XMLHttpRequest();
				xmlhttp.open("get", filename, false);
				xmlhttp.send(null);
				doc = xmlhttp.responseXML.documentElement;
			}
			catch (e)
			{
				console.log("Exception in Configuration.load() : "
					+ "Failed to load file \"" + filename + "\".\n"
					+ e.message);
			}
		}
	}
	
	return doc;
}

Configuration.prototype.getNodeByXPath = function(xpath)
{
	return this.xmlDoc.selectSingleNode(xpath);
}

Configuration.prototype.getNodesByXPath = function(xpath)
{
	return this.xmlDoc.selectNodes(xpath);
}

// end of Configuration.js


/***
* GameObject.js
* Version 1.2.2
* Last Modified 2018/01/16
***/

function GameObject(config)
{
	this.config = config;
	this.texture = null;
	this.bounding = null;
	this.mapReference = null;
}

GameObject.prototype.getBoundingBox = function() {}

GameObject.prototype.getCenter = function() {}

GameObject.prototype.getRadius = function() {}

GameObject.prototype.getBoundingType = function()
{
	return this.bounding.constructor;
}

GameObject.prototype.testHit = function(object) {}

GameObject.prototype.onHit = function(object) {}

GameObject.prototype.initForRendering = function(webgl) {}

GameObject.prototype.areResourcesReady = function() {}

GameObject.prototype.onRender = function(webgl) {}

GameObject.prototype.updateState = function() {}

// end of GameObject.js


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


/***
* EnvironmentItem.js
***/

function EnvironmentItem(config)
{
	GameObject.call(this, config);
}

EnvironmentItem.prototype = new GameObject();
EnvironmentItem.prototype.constructor = EnvironmentItem;

// end of EnvironmentItem.js


/***
* Block.js
***/

function Block(config)
{
	EnvironmentItem.call(this, config);
	
	this.bounding = Rect.makeRect();
}

Block.prototype = new EnvironmentItem();
Block.prototype.constructor = Block;

Block.prototype.getBoundingBox = function()
{
	return bounding;
}

Block.prototype.testHit = function(object)
{
	
}

Block.prototype.onHit = function(object)
{
	
}

// end of Block.js

/***
* Round.js
***/

function Round(config)
{
	EnvironmentItem.call(this, config);
	
	this.bounding = Circle.makeCircle();
}

Round.prototype = new EnvironmentItem();
Round.prototype.constructor = Round;

Round.prototype.getBoundingBox = function()
{
	return this.bounding.innerBounding();
}

Round.prototype.getCenter = function()
{
	return bounding.center;
}

Round.prototype.getRadius = function()
{
	return bounding.radius;
}

Round.prototype.testHit = function(object)
{
	
}

Round.prototype.onHit = function(object)
{
	
}

// end of Round.js


/***
* Decoration.js
***/

function Decoration(config)
{
	EnvironmentItem.call(this, config);
}

Decoration.prototype = new EnvironmentItem();
Decoration.prototype.constructor = Decoration;

Decoration.prototype.getBoundingBox = function() {}

Decoration.prototype.getCenter = function() {}

Decoration.prototype.getRadius = function() {}

Decoration.prototype.testHit = function(object)
{
	
}

Decoration.prototype.onHit = function(object)
{
	
}

// end of Decoration.js


/***
* AnimationObject.js
* Version 1.1
* Last Modified 2018/01/04
*/

function AnimationObject(config)
{
	GameObject.call(this, config);
	
	this.frames = [];
	this.currentFrame = -1;
	this.animationStep = AnimationObject.MODE_NORMAL;
}

AnimationObject.prototype = new GameObject();
AnimationObject.prototype.constructor = AnimationObject;

AnimationObject.MODE_STILL = 0;
AnimationObject.MODE_NORMAL = 1;
AnimationObject.MODE_REVERSE = -1;

AnimationObject.prototype.onRender = function() {}

AnimationObject.prototype.getRenderFrame = function()
{
	if (currentFrame >= 0 && currentFrame < frames.length)
	{
		return frames[currentFrame];
	}
	else
	{
		return null;
	}
}

AnimationObject.prototype.fetchNextFrame = function()
{
	currentFrame += animationStep;
	return AnimationObject.prototype.getRenderFrame();
}

AnimationObject.prototype.resetFramePointer = function()
{
	currentFrame = -1;
}

// end of AnimationObject.js


/***
* TouchPoint.js
***/

function TouchPoint(config)
{
	AnimationObject.call(this, config);
	
	this.bounding = Circle.makeCircle();
}

TouchPoint.prototype = new AnimationObject();
TouchPoint.prototype.constructor = TouchPoint;

TouchPoint.prototype.getBoundingBox = function()
{
	var halfEdge = bounding.radius / Math.SQRT2;
	
	var left = bounding.center.x - halfEdge;
	var top = bounding.center.y - halfEdge;
	
	return new Rect(left, top, halfEdge * 2, halfEdge * 2);
}

TouchPoint.prototype.getCenter = function()
{
	return bounding.center;
}

TouchPoint.prototype.getRadius = function()
{
	return bounding.radius;
}

// end of TouchPoint.js


/***
* Teleport.js
***/

function Teleport(config)
{
	TouchPoint.call(this, config);
}

Teleport.prototype = new TouchPoint();
Teleport.prototype.constructor = Teleport;

Teleport.prototype.testHit = function(object)
{
	
}

Teleport.prototype.onHit = function(object)
{
	
}

// end of Teleport.js


/***
* BenefitPoint.js
***/

function BenefitPoint(config)
{
	TouchPoint.call(this, config);
}

BenefitPoint.prototype = new TouchPoint();
BenefitPoint.prototype.constructor = BenefitPoint;

BenefitPoint.prototype.testHit = function(object)
{
	
}

BenefitPoint.prototype.onHit = function(object)
{
	
}

// end of BenefitPoint.js


/***
* RecoveryPoint.js
***/

function RecoveryPoint(config)
{
	TouchPoint.call(this, config);
}

RecoveryPoint.prototype = new TouchPoint();
RecoveryPoint.prototype.constructor = RecoveryPoint;

RecoveryPoint.prototype.testHit = function(object)
{
	
}

RecoveryPoint.prototype.onHit = function(object)
{
	
}

// end of RecoveryPoint.js


/***
* PlotPoint.js
***/

function PlotPoint(config)
{
	TouchPoint.call(this, config);
}

PlotPoint.prototype = new TouchPoint();
PlotPoint.prototype.constructor = PlotPoint;

PlotPoint.prototype.testHit = function(object)
{
	
}

PlotPoint.prototype.onHit = function(object)
{
	
}

// end of PlotPoint.js


/***
* Skill.js
***/

function Skill(config)
{
	AnimationObject.call(this, config);
	
	this.bounding = Circle.makeCircle();
	
	this.name = "";
	this.id = "";
	this.maxLevel = 1;
	this.level = 0;
	this.damage = 1;
	this.direction = Direction.NONE;
	this.speed = 1;
	this.doubleDamageRate = 0;
}

Skill.prototype = new AnimationObject();
Skill.prototype.constructor = Skill;

Skill.prototype.getBoundingBox = function()
{
	var halfEdge = bounding.radius / Math.SQRT2;
	
	var left = bounding.center.x - halfEdge;
	var top = bounding.center.y - halfEdge;
	
	return new Rect(left, top, halfEdge * 2, halfEdge * 2);
}

Skill.prototype.getCenter = function()
{
	return bounding.center;
}

Skill.prototype.getRadius = function()
{
	return bounding.radius;
}

Skill.prototype.release = function() {}

Skill.prototype.toNextLevel = function() {}

// end of Skill.js


/***
* Character.js
***/

function Character(config)
{
	AnimationObject.call(this, config);
	
	this.bounding = Circle.makeCircle();
	
	this.name = "";
	this.id = "";
	this.maxLevel = 1;
	this.maxHP = 1;
	this.maxMP = 1;
	this.level = 0;
	this.HP = 1;
	this.MP = 1;
	this.direction = Direction.NONE;
	this.speed = 1;
	this.skills = [];
}

Character.prototype = new AnimationObject();
Character.prototype.constructor = Character;

Character.prototype.getBoundingBox = function()
{
	var halfEdge = bounding.radius / Math.SQRT2;
	
	var left = bounding.center.x - halfEdge;
	var top = bounding.center.y - halfEdge;
	
	return new Rect(left, top, halfEdge * 2, halfEdge * 2);
}

Character.prototype.getCenter = function()
{
	return bounding.center;
}

Character.prototype.getRadius = function()
{
	return bounding.radius;
}

Character.prototype.toNextLevel = function() {}

Character.prototype.takeDamage = function(damage)
{
	HP -= damage;
	if (HP <= 0)
	{
		HP = 0;
		onDefeated();
	}
}

Character.prototype.onDefeated = function() {}

Character.prototype.makeSpeech = function() {}

// end of Character.js


/***
* Player.js
***/

function Player(config)
{
	Character.call(this, config);
	
	this.experience = 0;
}

Player.prototype = new Character();
Player.prototype.constructor = Player;

Player.prototype.toNextLevel = function() {}

Player.prototype.takeDamage = function(damage)
{
	Character.prototype.takeDamage(damage);
}

Player.prototype.onDefeated = function()
{
	
}

Player.prototype.makeSpeech = function()
{
	
}

Player.prototype.turn = function(dir)
{
	direction = dir;
}

Player.prototype.stepForward = function()
{
	
}

// end of Player.js


/***
* NPC.js
***/

function NPC(config)
{
	Character.call(this, config);
}

NPC.prototype = new Character()
NPC.prototype.constructor = NPC;

NPC.prototype.takeDamage = function(damage)
{
	
}

NPC.prototype.makeSpeech = function()
{
	
}

// end of NPC.js


/***
* Enemy.js
***/

function Enemy(config)
{
	Character.call(this, config);
}

Enemy.prototype = new Character();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.takeDamage = function(damage)
{
	Character.prototype.takeDamage(damage);
}

// end of Enemy.js


/***
* Boss.js
***/

function Boss(config)
{
	Enemy.call(this, config);
}

Boss.prototype = new Enemy();
Boss.prototype.constructor = Boss;

Boss.prototype.onDefeated = function()
{
	
}

Boss.prototype.makeSpeech = function()
{
	
}

// end of Boss.js


/***
* Plot.js
***/

function Plot(config, name)
{
	this.config = config;
	this.name = name;
}

Plot.prototype.onTriggered = function()
{
	
}

// end of Plot.js


/***
* PlotManager.js
***/

function PlotManager()
{
	this.plots = [];
	this.currentPlot = -1;
}

PlotManager.prototype.triggerNextPlot = function()
{
	currentPlot++;
	if (currentPlot >= 0 && currentPlot < plots.length)
	{
		plots[currentPlot].onTriggered();
		return true;
	}
	else
	{
		return false;
	}
}

// end of PlotManager.js


/***
* WebGL.js
* Version 1.2.1
* Last Modified 2018/01/16
***/

// WebGL wrapper for convenience
function WebGL(canvas)
{
	this.gl = null;
	this.view = Rect.makeRect();
	
	this.vertexShader = null;
	this.fragmentShader = null;
	this.shaderProgram = null;
	
	this.arrayData = null;
	
	this.init(canvas);
}

WebGL.prototype.init = function(canvas)
{
	if (canvas)
	{
		var o = { antialias: true, stencil: true };
		try
		{
			this.gl = canvas.getContext('webgl', o)
				|| canvas.getContext('experimental-webgl', o);
		}
		catch (e)
		{
			console.log(e.message);
			return;
		}
		this.view.width = canvas.width;
		this.view.height = canvas.height;
		
		this.arrayData = 
		{
			data : new Array(54),
			vSize : 9,	// 0-2: Position; 3-4: Texture coordinates; 5-8: Additional color
			vCount : 6,
			primitiveType : this.gl.TRIANGLES,
		}
		for (let i = 0; i < this.arrayData.data.length; i++)
		{
			this.arrayData.data[i] = 0;
		}
	}
}

WebGL.prototype.setViewport = function(x, y, width, height)
{
	this.view.left = x;
	this.view.top = y;
	this.view.width = width ? width : this.view.width;
	this.view.height = height ? height : this.view.height;
	this.gl.viewport(x, y, this.view.width, this.view.height);
}

WebGL.prototype.scrollViewport = function(offsetX, offsetY)
{
	this.view.left += offsetX;
	this.view.top += offsetY;
	this.gl.viewport(this.view.left, this.view.top,
		this.view.width, this.view.height);
}

WebGL.prototype.makeShader = function(source, shaderType)
{
	var gl = this.gl;
	var success = false;
	
	var shader = gl.createShader(shaderType);
	
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	
	success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
	
	if (!success)
	{
		console.error("could not compile shader:"
			+ gl.getShaderInfoLog(shader));
		return null;
	}
	
	if (shaderType == gl.VERTEX_SHADER)
	{
		this.vertexShader = shader;
	}
	else if (shaderType == gl.FRAGMENT_SHADER)
	{
		this.fragmentShader = shader;
	}
	
	return shader;
}

WebGL.prototype.compileShaderProgram = function(vertexShaderSource,
											fragmentShaderSource)
{
	var gl = this.gl;
	
	this.shaderProgram = gl.createProgram();
	this.makeShader(vertexShaderSource, gl.VERTEX_SHADER);
	this.makeShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
	
	gl.attachShader(this.shaderProgram, this.vertexShader);
	gl.attachShader(this.shaderProgram, this.fragmentShader);
}

WebGL.prototype.compileDefaultShaderProgram = function()
{
	var vertexShaderSource =
    "    attribute vec3 v3Position;" +
	"    attribute vec2 inTextureCoord;" +
	"    varying vec2 outTextureCoord;" +
	"    attribute vec4 inAdditionColor;" +
	"    varying vec4 outAdditionColor;" +
    "    void main(void)"+
	"    {" +
    "        gl_Position = vec4(v3Position, 1.0);" +
	"        outTextureCoord = inTextureCoord;" +
	"        outAdditionColor = inAdditionColor;" +
    "    }";
	var fragmentShaderSource =
	"    precision mediump float;" +
	"    uniform sampler2D u_Sampler;" +
	"    varying vec2 outTextureCoord;" +
	"    varying vec4 outAdditionColor;" +
    "    void main(void)" +
	"    {" +
    "        gl_FragColor = texture2D(u_Sampler, outTextureCoord)" +
	"            + outAdditionColor;" +
	"        gl_FragColor = outAdditionColor;" +
    "    }";
	this.compileShaderProgram(vertexShaderSource, fragmentShaderSource);
}

WebGL.prototype.linkShaderProgram = function()
{
	var gl = this.gl;
	
	gl.linkProgram(this.shaderProgram);
	
	success = gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS);
	
	if (!success)
	{
		console.error("program failed to link:"
			+ gl.getProgramInfoLog(this.shaderProgram));
	}
}

WebGL.prototype.clearScreen = function(color)
{
	this.gl.clearColor(color.r, color.g, color.b, color.a);
	this.gl.clearDepth(1);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT
		| this.gl.DEPTH_BUFFER_BIT
		| this.gl.GL_STENCIL_BUFFER_BIT);
}

WebGL.prototype.makeArrayData = function(object, additionalColor)
{
	var gl = this.gl;
	
	var view = object.mapReference.view;
	var box = object.bounding;
	
	if (object.bounding instanceof Circle)
	{
		box = object.bounding.outerBounding();
	}
	
	var xOffset = -1;
	var yOffset = 1;
	var xStretch = 2 / view.width;
	var yStretch = -2 / view.height;
	
	var corners = [box.topLeft(), box.topRight(),
				box.bottomLeft(), box.bottomRight()];
	
	for (let i = 0; i < corners.length; i++)
	{
		corners[i].x = (corners[i].x - view.left) * xStretch + xOffset;
		corners[i].y = (corners[i].y - view.top) * yStretch + yOffset;
	}
	
	// Every vertex has 9 data values.6 vertexes in total.
	// So array length is 54.
	this.arrayData.data[0] = corners[0].x;
	this.arrayData.data[1] = corners[0].y;
	this.arrayData.data[3] = 0.0;
	this.arrayData.data[4] = 0.0;
	
	this.arrayData.data[9] = corners[1].x;
	this.arrayData.data[10] = corners[1].y;
	this.arrayData.data[12] = 1.0;
	this.arrayData.data[13] = 0.0;
	
	this.arrayData.data[18] = corners[2].x;
	this.arrayData.data[19] = corners[2].y;
	this.arrayData.data[21] = 0.0;
	this.arrayData.data[22] = 1.0;
	
	this.arrayData.data[27] = corners[2].x;
	this.arrayData.data[28] = corners[2].y;
	this.arrayData.data[30] = 0.0;
	this.arrayData.data[31] = 1.0;
	
	this.arrayData.data[36] = corners[1].x;
	this.arrayData.data[37] = corners[1].y;
	this.arrayData.data[39] = 1.0;
	this.arrayData.data[40] = 0.0;
	
	this.arrayData.data[45] = corners[3].x;
	this.arrayData.data[46] = corners[3].y;
	this.arrayData.data[48] = 1.0;
	this.arrayData.data[49] = 1.0;
	
	// Set additional color values.
	for (let j = 0; j < this.arrayData.vCount; j++)
	{
		this.arrayData.data[j * 9 + 5] = additionalColor.r;
		this.arrayData.data[j * 9 + 6] = additionalColor.g;
		this.arrayData.data[j * 9 + 7] = additionalColor.b;
		this.arrayData.data[j * 9 + 8] = additionalColor.a;
	}
}

WebGL.prototype.image2Texture = function(image)
{
	var gl = this.gl;
	var textureID = gl.createTexture();
	
	gl.bindTexture(gl.TEXTURE_2D, textureID);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.bindTexture(gl.TEXTURE_2D, null);
	
	return textureID;
}

WebGL.prototype.drawPrimitive = function(object, image, additionalColor)
{
	if (!(object instanceof GameObject) || !image)
	{
		return;
	}
	
	var gl = this.gl;
	
    // Create a data buffer for WebGL.
	var dataBuffer = gl.createBuffer();
	
	var locV3Position = 0;
	var locInTextureCoord = 0;
	var locInAdditionColor = 0;
	
	// Sampler for textures.
	var sampler = null;
	var texture = 0;
	
	var color = additionalColor;
	
	if (!additionalColor || !(additionalColor instanceof Color))
	{
		color = new Color(0.0, 0.0, 0.0, 1.0);
	}
	
	// Make array data.
    this.makeArrayData(object, color);

	// Compile shaders.
	this.compileDefaultShaderProgram();
    // Set runtime values of "attributes" in shaders.
	// Must before shader program linking.
	// gl.bindAttribLocation(this.shaderProgram, 0, "v3Position");
	// gl.bindAttribLocation(this.shaderProgram, 1, "inTextureCoord");
	// gl.bindAttribLocation(this.shaderProgram, 2, "inAdditionColor"); |
	//																	v See below.
	
	// Link and set shader program.
	this.linkShaderProgram();
	// Tell WebGL which shader program to use.
	gl.useProgram(this.shaderProgram);
	
	// Set data array buffer to current.
	gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
	// Copy data to WebGL buffer.
	gl.bufferData(gl.ARRAY_BUFFER,
		new Float32Array(this.arrayData.vertexes), gl.STATIC_DRAW);
	
	// Tell WebGL to use this array buffer to draw!
	gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
	
	// Tell WebGL how to explain the data array.
	locV3Position = gl.getAttribLocation(this.shaderProgram, "v3Position");
	locInTextureCoord = gl.getAttribLocation(this.shaderProgram, "inTextureCoord");
	locInAdditionColor = gl.getAttribLocation(this.shaderProgram, "inAdditionColor");
    // Attributes: positionIndex, size, type, normalized, stride(interval), offset
	gl.vertexAttribPointer(locV3Position, 3, gl.FLOAT, false, 36, 0);
	gl.vertexAttribPointer(locInTextureCoord, 2, gl.FLOAT, false, 36, 12);
	gl.vertexAttribPointer(locInAdditionColor, 4, gl.FLOAT, false, 36, 20);
	// Enable the array data to be used.
	gl.enableVertexAttribArray(locV3Position);
	gl.enableVertexAttribArray(locInTextureCoord);
	gl.enableVertexAttribArray(locInAdditionColor);

	// Use texture.
	sampler = gl.getUniformLocation(this.shaderProgram, "u_Sampler");
	this.image2Texture(image);
	gl.activeTexture(gl.TEXTURE0);
	gl.uniform1i(sampler, 0);

    // Final draw.
	// Attributes: mode, first, count
	gl.drawArrays(this.arrayData.primitiveType, 0, this.arrayData.vCount);
}

// end of WebGL.js


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


/***
* Main.js
***/

window.onload = Main;

function Main(event)
{
	Main.prototype.init(event);
	
	console.log("main");
	
	this.config = new Configuration("assets/config/config.xml");
	this.gameMapIDs = ["sceneStart", "scene1", "scene2", "scene2-1",
		"scene2-2", "scene3", "scene4", "sceneFinal"];
	
	this.plotManager = new PlotManager();
	this.gameViewer = new GameViewer(config);
	this.gameViewer.addMaps(this.gameMapIDs);
	this.gameViewer.setCurrentMap(gameMapIDs[0]);
	
	console.log(this.gameViewer);
	
	this.gameViewer.renderBackground();
	// this.gameViewer.onRender();
	
	// GameLoop
	// while (true)
	// {
	//	
	// }
	
	Main.prototype.cleanUp();
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
}

Main.prototype.onMouseDown = function(event)
{
	
}

Main.prototype.onLeftButton = function(event)
{
	
}

Main.prototype.onRightButton = function(event)
{
	
}

Main.prototype.onKeyDown = function(event)
{
	
}

// end of Main.js
