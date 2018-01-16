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
* Version 1.2.3
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
* Last Modified 2018/01/16
***/

function Skill(config)
{
	AnimationObject.call(this, config);
	
	this.bounding = Circle.prototype.makeCircle();
	
	this.name = "Skill_base";
	this.id = "Skill_base";
	this.maxLevel = 5;
	this.level = 0;
	this.damage = 1;
	//The direction and the bounding box need be modified
	this.direction = Direction.NONE;
	this.speed = 1;
	this.doubleDamageRate = 0;
	//response times to the millisecond
	this.lifeTime = 500;
	
	this.released = false;
	
	this.mapReference = this;//这里需要修改
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


Skill.prototype.testHit = function(object)
{
	if (GameMap.isValidMapObject(object))
	{
		var box = object.getBoundingBox();
		
		return this.bounding.intersects(box) && !this.bounding.contains(box);
	}
	else
	{
		return false;
	}
}

Skill.prototype.onHit = function(object) {
	
	//技能击中物体动画
	
	return true;
}

function Skill_Melee(config)
{
	Skill.call(this, config);
	
	this.name = "Skill_Melee";
	this.id = "Skill_Melee";
	this.bounding = Circle.prototype.makeCircle();
	
	this.maxLevel = 5;
	this.level = 0;
	this.damage = 1;
	//The direction and the bounding box need be modified
	this.direction = Direction.NONE;
	this.speed = 1;
	this.doubleDamageRate = 0;
	//response times to the millisecond
	this.lifeTime = 200;
	
	this.released = false;
	this.mapReference = this;//这里需要修改
	
	this.time = 1;
}
// inheritance
Skill_Melee.prototype = Object.create(Skill.prototype);  
// child.prototype = new parent();
Skill_Melee.prototype.constructor = Skill_Melee;  

Skill.prototype.testHit = function(object)
{
	if (GameMap.isValidMapObject(object))
	{
		var box = object.getBoundingBox();
		
		return this.bounding.intersects(box) && !this.bounding.contains(box);
	}
	else
	{
		return false;
	}
}

//只调用一次，如果未击中则消失
Skill_Melee.prototype.release = function() 
{
	
	//说明上一个技能的生命周期结束，开始下一个
	if(this.lifeTime<=0) {
		//技能生命周期结束动画
		GameMap.removeObject(this, 5);
		this.released = false;
		this.lifeTime = 200;
		this.bounding = new circle(this.mapReference.bounding.center,this.radius);
	}
	
	if(!this.released) {
		
		//技能物体加进来
		GameMap.addObject(this, 5);
		var sqrt2_2 = 0.7071067811865475;
		switch (this.direction) {
			case Direction.NONE: this.skillDirection = new Point(0,0);break;
		
			case Direction.NORTH: this.skillDirection = new Point(1,0);break;
			case Direction.EAST: this.skillDirection = new Point(0,1);break;
			case Direction.SOUTH: this.skillDirection = new Point(-1,0);break;
			case Direction.WEST: this.skillDirection = new Point(0,-1);break;
		
			case Direction.NORTHEAST: this.skillDirection = new Point(sqrt2_2,sqrt2_2);break;
			case Direction.SOUTHEAST: this.skillDirection = new Point(sqrt2_2,-sqrt2_2);break;
			case Direction.NORTHWEST: this.skillDirection = new Point(-sqrt2_2,sqrt2_2);break;
			case Direction.SOUTHWEST: this.skillDirection = new Point(-sqrt2_2,-sqrt2_2);break;
		
			default : this.skillDirection = new Point(0,0);break;
		}
		this.released = true;
	}
	//冷冻时间
	this.lifeTime--;
	
}
  
// rewrite function
Skill_Melee.prototype.toNextLevel = function()
{
    if (this.level<this.maxLevel)
	{
		this.level = this.level + 1;
		
		//Update the properties of the level
		this.damage = this.damage + 0.3;
		//
		//this.speed = 0x7ffffff;
		
		this.doubleDamageRate = this.level*0.05;
		//this.freezingTime = this.freezingTime-this.level*100;
	}
	else
	{
		//Whether reminding users

	}
}

function Skill_Ranged(config)
{
	Skill.call(this, config);
	
	this.name = "Skill_Ranged";
	this.id = "Skill_Ranged";
	this.bounding = Circle.prototype.makeCircle();
	
	this.maxLevel = 5;
	this.level = 0;
	this.damage = 1.5;
	//The direction and the bounding box need be modified
	this.direction = Direction.NONE;
	this.speed = 20/1000;
	this.doubleDamageRate = 0;
	//response times to the millisecond
	this.lifeTime = 500;
	
	this.released = false;
	this.mapReference = this;//这里需要修改
	
	this.time = 1;
}
// inheritance
Skill_Ranged.prototype = Object.create(Skill.prototype);  
// child.prototype = new parent();
Skill_Ranged.prototype.constructor = Skill_Ranged;  
  

Skill_Ranged.prototype.testHit = function(object)
{
	if (GameMap.isValidMapObject(object))
	{
		var box = object.getBoundingBox();
		
		return this.bounding.intersects(box) && !this.bounding.contains(box);
	}
	else
	{
		return false;
	}
}

Skill_Ranged.prototype.onHit = function(object) {
	
	//技能击中物体动画
	
	return true;
}

Skill_Ranged.prototype.release = function() 
{
	//说明上一个技能的生命周期结束，开始下一个
	if(this.lifeTime<=0) {
		
		//技能生命周期结束动画
		GameMap.removeObject(this, 5);
		this.released = false;
		this.lifeTime = 500;
		this.bounding = new circle(this.mapReference.bounding.center,this.radius);
	}

	
	if(!this.released) {
		
		//技能物体加进来
		GameMap.addObject(this, 5);
		var sqrt2_2 = 0.7071067811865475;
		switch (this.direction) {
			case Direction.NONE: this.skillDirection = new Point(0,0);break;
		
			case Direction.NORTH: this.skillDirection = new Point(1,0);break;
			case Direction.EAST: this.skillDirection = new Point(0,1);break;
			case Direction.SOUTH: this.skillDirection = new Point(-1,0);break;
			case Direction.WEST: this.skillDirection = new Point(0,-1);break;
		
			case Direction.NORTHEAST: this.skillDirection = new Point(sqrt2_2,sqrt2_2);break;
			case Direction.SOUTHEAST: this.skillDirection = new Point(sqrt2_2,-sqrt2_2);break;
			case Direction.NORTHWEST: this.skillDirection = new Point(-sqrt2_2,sqrt2_2);break;
			case Direction.SOUTHWEST: this.skillDirection = new Point(-sqrt2_2,-sqrt2_2);break;
		
			default : this.skillDirection = new Point(0,0);break;
		}
		this.released = true;
	}

	//Firing skills along a certain direction.
	var centerPoint = this.getCenter();
	var radius = this.getRadius();
	
	var newPoint = new Point(skillDirection.x*this.speed+centerPoint.x,
							skillDirection.y*this.speed+centerPoint.y);
	
	//更新技能位置信息
	var newBounding = new Circle(newPoint, radius);
	
	this.bounding = newBounding;
	
	this.lifeTime = this.lifeTime-1;
}

Skill_Ranged.prototype.toNextLevel = function() 
{
	if (this.level<this.maxLevel)
	{
		//Update the window data: Property entries
		this.level = this.level + 1;
		//Update the properties of the level
		this.damage = this.damage + 0.3;
		this.speed = 0.5;
		this.doubleDamageRate = this.level*0.05;
	}
	else
	{
		//Whether reminding users
		
		
	}
}
//大招伤害高，但是速度慢？
function Skill_Ultimate(config)
{
	Skill.call(this, config);
	
	this.name = "Skill_Ultimate";
	this.id = "Skill_Ultimate";
	this.bounding = Circle.prototype.makeCircle();
	
	this.maxLevel = 5;
	this.level = 0;
	this.damage = 1.5;
	//The direction and the bounding box need be modified
	this.direction = Direction.NONE;
	this.speed = 20/1000;
	this.doubleDamageRate = 0;
	//response times to the millisecond
	this.lifeTime = 1000;
	
	this.released = false;
	this.mapReference = this;//这里需要修改

}
// inheritance
Skill_Ultimate.prototype = Object.create(Skill.prototype);  
// child.prototype = new parent();
Skill_Ultimate.prototype.constructor = Skill_Ultimate;  


Skill_Ultimate.prototype.release = function() 
{
	
	if(this.lifeTime<=0) {
		//技能生命周期结束动画
		GameMap.removeObject(this, 5);
		this.released = false;
		this.lifeTime = 1000;
		this.bounding = new circle(this.mapReference.bounding.center,this.radius);
	}

	
	if(!this.released) {
		
		//技能物体加进来
		GameMap.addObject(this, 5);
		var sqrt2_2 = 0.7071067811865475;
		switch (this.direction) {
			case Direction.NONE: this.skillDirection = new Point(0,0);break;
		
			case Direction.NORTH: this.skillDirection = new Point(1,0);break;
			case Direction.EAST: this.skillDirection = new Point(0,1);break;
			case Direction.SOUTH: this.skillDirection = new Point(-1,0);break;
			case Direction.WEST: this.skillDirection = new Point(0,-1);break;
		
			case Direction.NORTHEAST: this.skillDirection = new Point(sqrt2_2,sqrt2_2);break;
			case Direction.SOUTHEAST: this.skillDirection = new Point(sqrt2_2,-sqrt2_2);break;
			case Direction.NORTHWEST: this.skillDirection = new Point(-sqrt2_2,sqrt2_2);break;
			case Direction.SOUTHWEST: this.skillDirection = new Point(-sqrt2_2,-sqrt2_2);break;
		
			default : this.skillDirection = new Point(0,0);break;
		}
		this.released = true;
	}
	
	this.lifeTime = this.lifeTime-1;
	
	//Firing skills along a certain direction.
	var centerPoint = this.getCenter();
	var radius = this.getRadius();
	
	
	var newPoint = new Point(skillDirection.x*this.speed+centerPoint.x,
							skillDirection.y*this.speed+centerPoint.y);
	
	//更新技能位置信息
	var newBounding = new Circle(newPoint, radius);
	
	this.bounding = newBounding;
}

Skill_Ultimate.prototype.toNextLevel = function()
{
    if (this.level<this.maxLevel)
	{
		this.level = this.level + 1;
		
		//Update the properties of the level
		this.damage = this.damage + 0.3;
		//
		this.speed = 20/1000;
		this.doubleDamageRate = this.level*0.15;
		//this.freezingTime = this.freezingTime-this.level*100;
	}
	else
	{
		//Whether reminding users
		
	}
}

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
	this.maxExperience = 10;
	this.skills[0] = new Skill_Melee(config);
	this.skills[1] = new Skill_Ranged(config);
	this.skills[2] = new Skill_Ultimate(config);
	this.skills[0].mapReference = this;
	this.skills[1].mapReference = this;
	this.skills[2].mapReference = this;
	
	this.lastBounding = this.bounding;
}

Player.prototype = new Character();
Player.prototype.constructor = Player;

Player.prototype.onHit = function(object) {
	
	if(object instanceof Skill) {
	
		if(object.mapReference instanceof Player) {
			
			//技能消失，伤害不变
			return false;
		}
		//敌军伤害
		else {
			var damage = object.damage;
			if(Math.random()<=object.doubleDamageRate) {
				damage = 2*damage;
			}
			this.HP = this.HP-damage;
			if(this.HP<=0) {
				//自己阵亡
				GameMap.removeObjcet(this, 5);
				
				//跳转失败画面
				return true;
			}
			else {
				//受伤画面？
				return false;
			}
		}
	}
	//非技能，敌人或墙体
	else {
		//恢复原来位置，不再向前移动
		this.bounding = this.lastBounding;
		return false;
	}
	
}

//如果经验值达到一定值，则进入下一层，同时更新其相应的技能
Player.prototype.toNextLevel = function() 
{
	
	if(this.experience>=this.maxExperience) {
		
		this.experience = this.experience - this.maxExperience;
		this.HP = this.maxHP;
		this.MP = this.maxMP;
		this.speed = this.speed+10;
		for(var i=0;i<this.skills.length;i++) {		
			this.skills[i].toNextLevel();
		}
	}
}

Player.prototype.takeDamage = function(damage)
{
	Character.prototype.takeDamage(damage);
}

Player.prototype.onDefeated = function()
{
	//出现失败画面
	
	return;

}

Player.prototype.makeSpeech = function()
{
	
}

//
Player.prototype.turn = function(dir)
{
	direction = dir;
}

Player.prototype.stepForward = function()
{
	//接收键盘事件
	var dir = Direction.NONE;
	this.turn(dir);
	var sqrt2_2 = 0.7071067811865475;
	var dirvector = new Point(0,0);
	switch (this.direction) {
		case Direction.NONE: dirvector = new Point(0,0);break;
	
		case Direction.NORTH: dirvector = new Point(1,0);break;
		case Direction.EAST: dirvector = new Point(0,1);break;
		case Direction.SOUTH: dirvector = new Point(-1,0);break;
		case Direction.WEST: dirvector = new Point(0,-1);break;
	
		case Direction.NORTHEAST: dirvector = new Point(sqrt2_2,sqrt2_2);break;
		case Direction.SOUTHEAST: dirvector = new Point(sqrt2_2,-sqrt2_2);break;
		case Direction.NORTHWEST: dirvector = new Point(-sqrt2_2,sqrt2_2);break;
		case Direction.SOUTHWEST: dirvector = new Point(-sqrt2_2,-sqrt2_2);break;
	
		default : dirvector = new Point(0,0);break;
	}
	var centerPoint = this.bounding.center;
	var newPoint = new Point(centerPoint.x+this.speed*dirvector.x,centerPoint.y+this.speed*dirvector.y);
	
	this.lastBounding = this.bounding;
	this.bounding = new circle(newPoint, this.bounding.radius);
	
}

Player.prototype.releaseSkill = function(number)
{
	switch(number) {
		
		case 0: this.skills[0].release();break;
		case 1:	this.skills[1].release();break;
		case 2: this.skills[2].release();break;
		
		
	}
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
* Version 1.2
* Last Modified 2018/01/16
***/

function Enemy(config)
{
	Character.call(this, config);
	this.lifecycle = 20;
	this.currentDirection = Direction.NONE;
	this.responseDistance = 50;
	
	this.directionVector = null;
	this.possibleDirection = new Array(4);
	this.player = null;
	this.time = 5;
}

Enemy.prototype = new Character();
Enemy.prototype.constructor = Enemy;

Enemy.prototype.takeDamage = function(damage)
{
	Character.prototype.takeDamage(damage);
}

Enemy.prototype.testHit = function(object)
{
	if (GameMap.isValidMapObject(object))
	{
		var box = object.getBoundingBox();
		
		return this.bounding.intersects(box) && !this.bounding.contains(box);
	}
	else
	{
		return false;
	}
}

Enemy.prototype.onHit = function(object) {
	
	if(object instanceof Skill) {
		
		//判断技能是否为敌军

		
		if(object.mapReference instanceof Enemy) {
			
			//敌军自己打到自己，技能消失，血量不变
			return false;
		}
		
		var damage = object.damage;
		if(Math.random()<=object.doubleDamageRate) {
			damage = 2*damage;
		}
		this.HP = this.HP-damage;
		if(this.HP<=0) {
			//敌军阵亡
			GameMap.removeObjcet(this, 5);
			return true;
		}
		else {
			return false;
		}
	}
	//碰到非技能物体例如player和墙壁，就向其他方向运动
	else {

		var objectBounding = object.bounding;
		
		//都是圆形吗
		
		//恢复到原来位置
			
		var enemyPoint = this.bounding.center;
		var playerPoint = player.bounding.center;
		
		var enemyDirection = this.directionVector;
	
		var axis = 0;
		if(abs(enemyDirection.x)<abs(enemyDirection.y)) axis = 1;
		if(enemyDirection.x<0) {
			enemyDirection.x = -1;
			
		}
		else if(enemyDirection.x>0) {
			enemyDirection.x=1;
			
		}
		if(enemyDirection.y<0) {
			enemyDirection.y = -1;
			
		}
		else if(enemyDirection.y>0) {
			enemyDirection.y=1;
			
		}
		var newBounding = null;
		if(axis==0)
			newBounding = new Point(enemyPoint.x,enemyPoint.y-enemyDirection.y*this.speed);
		else
			newBounding = new Point(enemyPoint.x-enemyDirection.x*this.speed,enemyPoint.y);
		
		
		//和原来方向相反运动
		switch(this.currentDirection) {
			
			case Direction.WEST: 
				this.currentDirection = Direction.EAST;
				newBounding.x = newBounding.x+this.speed;
				break;
			case Direction.EAST:
				this.currentDirection = Direction.WEST;
				newBounding.x = newBounding.x-this.speed;
				break;
			case Direction.NORTH: 
				this.currentDirection = Direction.SOUTH;
				newBounding.x = newBounding.y-this.speed;
				break;
			case Direction.SOUTH:
				this.currentDirection = Direction.NORTH;
				newBounding.x = newBounding.y+this.speed;
				break;
			
		}
		this.bounding = new Circle(newBounding, this.bounding.radius);
		this.time = 5;
		
		
	}
	
	return false;
}


//敌军的移动，分两种情况探讨，如果在响应距离之内，向player移动。如果在响应距离之外，自由移动。
Enemy.prototype.doNextStep = function(player) {
	
	this.player = player;
	
	var circlePlayer = player.bounding;
	//The two bounding box interect with each other.
	var centerDistance = this.bounding.centerDistanceWith(circlePlayer);
	var surfaceDistance = this.bounding.surfaceDistanceWith(circlePlayer);
	
	
	var enemyPoint = this.bounding.center;
	var playerPoint = player.bounding.center;
	
	if(surfaceDistance<=this.responseDistance) {
		
		this.directionVector = new Point(playerPoint.x-enemyPoint.x, playerPoint.y-enemyPoint.y);
		var enemyDirection = this.directionVector;
		
		var newBounding = new Point(enemyPoint.x,enemyPoint.y);
		
		if(this.time>=0) {
			
			switch(this.currentDirection) {
				
				case Direction.WEST: 
					newBounding.x = newBounding.x-this.speed;
					break;
				case Direction.EAST:
					newBounding.x = newBounding.x+this.speed;
					break;
				case Direction.NORTH: 
					newBounding.x = newBounding.y+this.speed;
					break;
				case Direction.SOUTH:
					newBounding.x = newBounding.y-this.speed;
					break;
				
			}
			this.bounding = new Circle(new Point(enemyPoint.x+enemyDirection.x*this.speed,enemyPoint.y),this.bounding.radius);
			time--;
			return;
		}
		
		
		var axis = 0;
		if(abs(enemyDirection.x)<abs(enemyDirection.y)) axis = 1;
		if(enemyDirection.x<0) {
			enemyDirection.x = -1;
			this.currentDirection = Direction.WEST;
		}
		else if(enemyDirection.x>0) {
			enemyDirection.x=1;
			this.currentDirection = Direction.EAST;
		}
		if(enemyDirection.y<0) {
			enemyDirection.y = -1;
			this.currentDirection = Direction.SOUTH;
		}
		else if(enemyDirection.y>0) {
			enemyDirection.y=1;
			this.currentDirection = Direction.NORTH;
		}
		
		
		//说明两者相交了
		if(surfaceDistance<=0) {
			//避免这种问题的发生
			
			if(axis==0) {
				this.bounding = new Circle(new Point(enemyPoint.x-enemyDirection.x*this.speed,enemyPoint.y),this.bounding.radius);
			}
			
			else {
				this.bounding = new Circle(new Point(enemyPoint.x,enemyPoint.y-enemyDirection.y*this.speed),this.bounding.radius);
			}
			
		}
		else {
			
			
			//确定enemy的移动方向，暂定上下左右
			if(axis==0) {
				
				this.bounding = new Circle(new Point(enemyPoint.x+enemyDirection.x*this.speed,enemyPoint.y),this.bounding.radius);
			}
			else {
				this.bounding = new Circle(new Point(enemyPoint.x,enemyPoint.y+enemyDirection.y*this.speed),this.bounding.radius);			
			}
			
		}
		
	}
	//在响应距离之外，随机移动
	else {
		
		
		var enemyPoint = this.bounding.center;
		var playerPoint = player.bounding.center;
		var newBounding = Circle.prototype.makeCircle();
		var enemyDirection = Point.prototype.makePoint();
		//Init direction
		if(this.direction = Direction.NONE)
		{
			var index = Math.floor(Math.random()*4);
			
			switch(index)
			{
				case 0:enemyDirection.x=1;enemyDirection.y=0;break;
				case 1:enemyDirection.x=0;enemyDirection.y=1;break;
				case 2:enemyDirection.x=-1;enemyDirection.y=0;break;
				case 3:enemyDirection.x=0;enemyDirection.y=-1;break;
			}
			newBounding = new Circle(new Point(enemyPoint.x+enemyDirection.x*this.speed,enemyPoint.y+enemyDirection.y*this.speed),this.bounding.radius);
			
		}
		
		else
		{
			switch(this.direction)
			{
				case Direction.EAST:enemyDirection.x=1;enemyDirection.y=0;break;
				case Direction.NORTH:enemyDirection.x=0;enemyDirection.y=1;break;
				case Direction.WEST:enemyDirection.x=-1;enemyDirection.y=0;break;
				case Direction.SOUTH:enemyDirection.x=0;enemyDirection.y=-1;break;
			}
			newBounding = new Circle(new Point(enemyPoint.x+enemyDirection.x*this.speed,enemyPoint.y+enemyDirection.y*this.speed),this.bounding.radius);
			
		}
		this.bounding = newBounding;
	}
}

//是否攻击的操作
Enemy.prototype.doNextAction = function(player)
{
	
	
}

function Enemy_Melee(config)
{
	Enemy.call(this, config);
	this.lifecycle = 20;
	this.currentDirection = Direction.NONE;
	this.responseDistance = 60;
	this.skills[0] = new Skill_Melee(config);
	
	this.skills[0].mapReference = this;
	
}
Enemy_Melee.prototype = Object.create(Enemy.prototype);  
Enemy_Melee.prototype.constructor = Enemy_Melee;

// rewrite function
Enemy_Melee.prototype.doNextAction = function(player)
{
	var circlePlayer = player.bounding;
	//The two bounding box interect with each other.
	var centerDistance = this.bounding.centerDistanceWith(circlePlayer);
	var surfaceDistance = this.bounding.surfaceDistanceWith(circlePlayer);
	
	for(var i=0;i<this.skills.length;i++)
	{
		var skill = skills[i];
		if(skill.bounding.radius>=centerDistance)
		{
			//set atack direction
			var enemyPoint = this.bounding.center;
			var circlePoint = circlePlayer.center;
			var x_axis = circlePoint.x-enemyPoint.x;
			var y_axis = circlePoint.y-enemyPoint.y;
			var tempDirection = Direction.NONE;
			if(abs(x_axis)>abs(y_axis)) {
				if(x_axis>0) tempDirection = Direction.EAST;
				else tempDirection = Direction.WEST;
			}
			else
			{
				if(y_axis>0) tempDirection = Direction.NORTH;
				else tempDirection = Direction.SOUTH;
			}
			
			//方向和敌军的移动方向一致？
			//this.skill[i].direction = this.currentDirection;
			this.skill[i].direction = tempDirection;
			
			//Release skill
			this.skill[i].release();
			
			//break;
		}
	}
}

function Enemy_Ranged(config)
{
	Enemy.call(this, config);
	this.lifecycle = 20;
	this.currentDirection = Direction.NONE;
	this.responseDistance = 60;
	this.skills[0] = new Skill_Ranged(config);
	this.skills[0].mapReference = this;
}
Enemy_Ranged.prototype = Object.create(Enemy.prototype);  
Enemy_Ranged.prototype.constructor = Enemy_Ranged;

// rewrite function
Enemy_Ranged.prototype.doNextAction = function(player)
{
	var circlePlayer = player.bounding;
	//The two bounding box interect with each other.
	var centerDistance = this.bounding.centerDistanceWith(circlePlayer);
	var surfaceDistance = this.bounding.surfaceDistanceWith(circlePlayer);
	
	for(var i=0;i<this.skills.length;i++)
	{
		var skill = skills[i];
		if(skill.bounding.radius>=surfaceDistance)
		{
			//set atack direction
			var enemyPoint = this.bounding.center;
			var circlePoint = circlePlayer.center;
			var x_axis = circlePoint.x-enemyPoint.x;
			var y_axis = circlePoint.y-enemyPoint.y;
			var tempDirection = Direction.NONE;
			if(abs(x_axis)>abs(y_axis)) {
				if(x_axis>0) tempDirection = Direction.EAST;
				else tempDirection = Direction.WEST;
			}
			else
			{
				if(y_axis>0) tempDirection = Direction.NORTH;
				else tempDirection = Direction.SOUTH;
			}
			this.skill[i].direction = tempDirection;
			
			//Release skill
			this.skill[i].release();
			//break;
		}
	}
}

// end of Enemy.js


/***
* Boss.js
* Version 1.2
* Last Modified 2018/01/16
***/

function Boss(config)
{
	Enemy.call(this, config);
	this.skills[0]= new Skill_Melee(config);
	this.skills[1]= new Skill_Ranged(config);
	this.skills[2]= new Skill_Ultimate(config);
	
	this.skills[0].mapReference = this;
	this.skills[1].mapReference = this;
	this.skills[2].mapReference = this;
	this.HP=1000;
	this.speed = 100;
	this.name = "Dead Line";
}

Boss.prototype = new Enemy();
Boss.prototype.constructor = Boss;


//是否重新实现boss的自动移动

Boss.prototype.onDefeated = function()
{
	//Set onDefeated parameter
	
	if(this.HP<=0) {
		
		//最终死亡动画
		
		//战胜跳转，成绩展示等
		
	}
	
}

Boss.prototype.makeSpeech = function()
{
	
	//情节展示
	
	
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
