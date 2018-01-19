// JavaScript Document
//
// Main Engine
//

/***
* Utility.js
* Version 1.3.0
* Last Modified 2018/01/18
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
* Version 1.2.6
* Last Modified 2018/01/18
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

Rect.prototype.right = function()
{
	return this.left + this.width;
}

Rect.prototype.bottom = function()
{
	return this.top + this.height;
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
	if (rect instanceof Rect)
	{
		return this.contains(rect.topLeft())
			|| this.contains(rect.topRight())
			|| this.contains(rect.bottomLeft())
			|| this.contains(rect.bottomRight());
	}
	return false;
}

Rect.prototype.awayFrom = function(rect)
{
	if (rect instanceof Rect)
	{
		return this.left > rect.right()
			|| this.right() < rect.left
			|| this.top > rect.bottom()
			|| this.bottom() < rect.top;
	}
	return false;
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
	if (circle instanceof Circle)
	{
		return circle.center.distanceWith(this.center);
	}
	return 0;
}

Circle.prototype.surfaceDistanceWith = function(circle)
{
	if (circle instanceof Circle)
	{
		return this.centerDistanceWith(circle) - (this.radius + circle.radius);
	}
	return 0;
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
	if (circle instanceof Circle)
	{
		return circle.centerDistanceWith(this) <= circle.radius + this.radius;
	}
	return 0;
}

Circle.prototype.awayFrom = function(circle)
{
	if (circle instanceof Circle)
	{
		return this.surfaceDistanceWith(circle) > 0;
	}
	return 0;
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

Color.prototype.addColor = function(color)
{
	this.r += color.r;
	this.g += color.g;
	this.b += color.b;
}

Color.prototype.mixColor = function(color)
{
	this.r *= color.r;
	this.g *= color.g;
	this.b *= color.b;
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
* GameMap.js
* Version 1.3.2
* Last Modified 2018/01/18
*/

function GameMap(config)
{
	this.config = config;
	
	this.bounding = Rect.makeRect();
	this.view = Rect.makeRect();
	this.birthPlace = Circle.makeCircle();
	
	this.id = "";
	this.name = "";
	
	this.texture = null;
	
	this.objects = null;
	
	this.resetMap();
}

GameMap.UNKNOWN = -1;
GameMap.MAP = 0;
GameMap.HIDDEN = 1;
GameMap.GROUND = 2;
GameMap.MIDDLE = 3;
GameMap.FLOWING = 4;
GameMap.UPPER = 5;
GameMap.LAYERS_COUNT = 6;

GameMap.prototype.getBoundingBox = function()
{
	return this.bounding;
}

GameMap.prototype.getMapObject = function()
{
	if (this.objects.length > GameMap.MAP
		&& this.objects[GameMap.MAP].length > 0)
	{
		return this.objects[GameMap.MAP][0];
	}
	return null;
}

GameMap.prototype.getViewObject = function()
{
	if (this.objects.length > GameMap.MAP
		&& this.objects[GameMap.MAP].length > 1)
	{
		return this.objects[GameMap.MAP][1];
	}
	return null;
}

GameMap.prototype.getBirthPlaceObject = function()
{
	if (this.objects.length > GameMap.HIDDEN)
	{
		var object = null;
		for (let j = 0; j < this.objects[GameMap.HIDDEN].length; j++)
		{
			object = this.objects[GameMap.HIDDEN][j];
			if (object instanceof BirthPlace)
			{
				return object;
			}
		}
	}
	return null;
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

GameMap.prototype.setBackground = function(filename)
{
	var mapObject = this.getMapObject();
	if (mapObject)
	{
		mapObject.loadResources(filename);
		this.texture = mapObject.texture;
	}
}

GameMap.prototype.areResourcesReady = function()
{
	var areReady = true;
	for (let layer = GameMap.MAP; layer < GameMap.LAYERS_COUNT; layer++)
	{
		for (let j = 0; j < this.objects[layer].length; j++)
		{
			if (this.objects[layer][j])
			{
				areReady = areReady && this.objects[layer][j].areResourcesReady();
			}
		}
	}
	return areReady;
}

GameMap.prototype.renderBackground = function(webgl)
{
	webgl.drawPrimitive(this.bounding, this.view, this.texture);
}

GameMap.prototype.onRender = function(webgl)
{
	var object = null;
	this.renderBackground(webgl);
	
	// Ignore hidden objects.
	for (let i = GameMap.HIDDEN + 1; i < GameMap.LAYERS_COUNT; i++)
	{
		for (let j = 0; j < this.objects[i].length; j++)
		{
			object = this.objects[i][j];
			if (object && ! this.view.awayFrom(object.getBoundingBox()))
			{
				object.onRender(webgl);
			}
		}
	}
}

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
	var imageFile = "";
	
	var layerNames = ["map", "hidden", "ground", "middle", "flowing", "upper"];
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
	
	for (let layer = GameMap.MAP; layer < GameMap.LAYERS_COUNT; layer++)
	{
		for (let group = 0; group < allGroups[layer].length; group++)
		{
			try
			{
				objectLayer = eval("GameMap."
					+ allGroups[layer][group].getAttribute("layer")
					.toUpperCase().valueOf());
				objectClass = allGroups[layer][group].getAttribute("class").valueOf();
				imageFile = allGroups[layer][group].getAttribute("img").valueOf();
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
						
						if (imageFile)
						{
							gameObject.loadResources(imageFile);
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
		var mapObject = this.getMapObject();
		var viewObject = this.getViewObject();
		var birthPlaceObject = this.getBirthPlaceObject();
		
		this.bounding = mapObject.bounding;
		this.texture = mapObject.texture;
		
		this.view = viewObject.bounding;
		this.birthPlace = birthPlaceObject.bounding;
	}
	catch (e)
	{
		console.log(e.message);
	}
}

GameMap.prototype.setView = function(x, y, width, height)
{
	this.view.setRect(x, y, width, height);
}

GameMap.prototype.setViewSize = function(width, height)
{
	this.setView(this.view.left, this.view.top, width, height);
}

GameMap.prototype.setViewTopLeft = function(x, y)
{
	this.setView(x, y, this.view.width, this.view.height);
}

GameMap.prototype.scrollView = function(offsetX, offsetY)
{
	this.setView
	(
		this.view.left + offsetX,
		this.view.top + offsetY,
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

GameMap.prototype.viewAtBirthPlace = function()
{
	if (this.birthPlace)
	{
		this.viewAt(this.birthPlace.center);
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
	var object = null;
	for (let layer = GameMap.MAP; layer < GameMap.LAYERS_COUNT; layer++)
	{
		for (let j = 0; j < this.objects[layer].length; j++)
		{
			object = this.objects[layer][j];
			if (object)
			{
				object.updateState();
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
* GameObject.js
* Version 1.2.4
* Last Modified 2018/01/17
***/

function GameObject(config)
{
	this.config = config;
	this.texture = new Image();
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

GameObject.prototype.loadResources = function(filename) {}

GameObject.prototype.onResourcesLoad = function() {}

GameObject.prototype.areResourcesReady = function()
{
	return true;
}

GameObject.prototype.onRender = function(webgl) {}

GameObject.prototype.updateState = function() {}

// end of GameObject.js


/***
* EnvironmentItem.js
* Version 1.0.0
* Last Modified 2018/01/17
***/

function EnvironmentItem(config)
{
	GameObject.call(this, config);
	
	this.textureLoaded = false;
}

EnvironmentItem.prototype = new GameObject();
EnvironmentItem.prototype.constructor = EnvironmentItem;

EnvironmentItem.prototype.loadResources = function(filename)
{
	if (!this.texture)
	{
		this.texture = new Image();
	}
	this.textureLoaded = false;
	this.texture.onload = this.onResourcesLoad;
	this.texture.src = filename;
}

EnvironmentItem.prototype.onResourcesLoad = function()
{
	if (this.texture)
	{
		this.textureLoaded = true;
		this.texture.onload = null;
	}
}

EnvironmentItem.prototype.areResourcesReady = function()
{
	return this.textureLoaded;
}

EnvironmentItem.prototype.updateState = function() {}

// end of EnvironmentItem.js


/***
* Block.js
* Version 1.0.0
* Last Modified 2018/01/17
***/

function Block(config)
{
	EnvironmentItem.call(this, config);
	
	this.bounding = Rect.makeRect();
	
	this.texture = new Image();
	this.textureFile = "";
	this.textureLoaded = false;
}

Block.prototype = new EnvironmentItem();
Block.prototype.constructor = Block;

Block.prototype.getBoundingBox = function()
{
	return this.bounding;
}

Block.prototype.testHit = function(object)
{
	if (object instanceof GameObject)
	{
		var box = object.getBoundingBox();
		if (box)
		{
			return this.bounding.intersects(box);
		}
	}
	return false;
}

Block.prototype.onHit = function(object)
{
	return false;
}

Block.prototype.onRender = function(webgl)
{
	if (this.mapReference)
	{
		webgl.drawPrimitive(this.bounding, this.mapReference.view, this.texture);
	}
}

// end of Block.js


/***
* Round.js
* Version 1.0.0
* Last Modified 2018/01/17
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
	return this.bounding.outerBounding();
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
	if (object instanceof GameObject)
	{
		var box = object.bounding;
		if (box instanceof Circle)
		{
			return this.bounding.intersects(box);
		}
		else if (box instanceof Rect)
		{
			return box.intersects(this.bounding.innerBounding());
		}
	}
	return false;
}

Round.prototype.onHit = function(object)
{
	return false;
}

Round.prototype.onRender = function(webgl)
{
	if (this.mapReference)
	{
		webgl.drawPrimitive(this.bounding.outerBounding(),
			this.mapReference.view,
			this.texture);
	}
}

// end of Round.js


/***
* Decoration.js
* Version 1.0.0
* Last Modified 2018/01/18
***/

function Decoration(config)
{
	EnvironmentItem.call(this, config);
	
	this.bounding = Rect.makeRect();
	
	this.texture = new Image();
	this.textureFile = "";
	this.textureLoaded = false;
}

Decoration.prototype = new EnvironmentItem();
Decoration.prototype.constructor = Decoration;

Decoration.prototype.getBoundingBox = function()
{
	return this.bounding;
}

Decoration.prototype.testHit = function(object)
{
	return false;
}

Decoration.prototype.onHit = function(object)
{
	return false;
}

Decoration.prototype.onRender = function(webgl)
{
	if (this.mapReference)
	{
		webgl.drawPrimitive(this.bounding, this.mapReference.view, this.texture);
	}
}

// end of Decoration.js


/***
* BirthPlace.js
* Version 1.0.0
* Last Modified 2018/01/18
***/

function BirthPlace(config)
{
	EnvironmentItem.call(this, config);
	
	this.bounding = Circle.makeCircle();
	
	this.texture = null;
}

BirthPlace.prototype = new EnvironmentItem();
BirthPlace.prototype.constructor = BirthPlace;

BirthPlace.prototype.getBoundingBox = function()
{
	return this.bounding.outerBounding();
}

BirthPlace.prototype.getCenter = function()
{
	return bounding.center;
}

BirthPlace.prototype.getRadius = function()
{
	return bounding.radius;
}

BirthPlace.prototype.testHit = function(object)
{
	return false;
}

BirthPlace.prototype.onHit = function(object)
{
	return false;
}

BirthPlace.prototype.onRender = function(webgl) {}

// end of BirthPlace.js


/***
* AnimationObject.js
* Version 1.2.0
* Last Modified 2018/01/18
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

AnimationObject.prototype.updateState = function() {}

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
* Version 1.0.0
* Last Modified 2018/01/18
***/

function TouchPoint(config)
{
	AnimationObject.call(this, config);
	
	this.bounding = Circle.makeCircle();
	
	this.texture = new Image();
	this.textureFile = "";
	this.textureLoaded = false;
}

TouchPoint.prototype = new AnimationObject();
TouchPoint.prototype.constructor = TouchPoint;

TouchPoint.prototype.getBoundingBox = function()
{
	return this.bounding.outerBounding();
}

TouchPoint.prototype.getCenter = function()
{
	return this.bounding.center;
}

TouchPoint.prototype.getRadius = function()
{
	return this.bounding.radius;
}

TouchPoint.prototype.loadResources = function(filename)
{
	if (!this.texture)
	{
		this.texture = new Image();
	}
	this.textureLoaded = false;
	this.texture.onload = this.onResourcesLoad;
	this.texture.src = filename;
}

TouchPoint.prototype.onResourcesLoad = function()
{
	if (this.texture)
	{
		this.textureLoaded = true;
		this.texture.onload = null;
	}
}

TouchPoint.prototype.areResourcesReady = function()
{
	return this.textureLoaded;
}

TouchPoint.prototype.onRender = function() {}

TouchPoint.prototype.updateState = function() {}

// end of TouchPoint.js


/***
* Teleport.js
* Version 1.0.0
* Last Modified 2018/01/18
***/

function Teleport(config)
{
	TouchPoint.call(this, config);
	
	this.colorMean = new Color(0.35, 0.35, 0.35, 1.0);
	this.additionalColor = new Color(0.0, 0.0, 0.0, 1.0);
	this.sineStep = 0;
	this.sineStepMax = 120;
	this.sinePeak = 0.35;
	this.sineStepLength = Math.PI * 2 / this.sineStepMax;
}

Teleport.prototype = new TouchPoint();
Teleport.prototype.constructor = Teleport;

Teleport.prototype.testHit = function(object)
{
	if (object instanceof Player)
	{
		return this.bounding.surfaceDistanceWith(player.bounding) < -3;
	}
	return false;
}

Teleport.prototype.onHit = function(object)
{
	if (object instanceof Player)
	{
		
	}
	return false;
}

Teleport.prototype.onRender = function(webgl)
{
	if (this.mapReference)
	{
		webgl.drawPrimitive(this.bounding.outerBounding(),
			this.mapReference.view,
			this.texture, 
			this.additionalColor);
	}
}

Teleport.prototype.updateState = function()
{
	var addition = Math.sin(this.sineStep * this.sineStepLength) * this.sinePeak;
	this.additionalColor.r = this.colorMean.r + addition;
	this.additionalColor.g = this.colorMean.g + addition;
	this.additionalColor.b = this.colorMean.b + addition;
	this.sineStep = (this.sineStep + 1) % this.sineStepMax;
}

// end of Teleport.js


/***
* BenefitPoint.js
* Version 1.0.0
* Last Modified 2018/01/18
***/

function BenefitPoint(config)
{
	TouchPoint.call(this, config);
	
	this.colorMean = new Color(0.35, 0.35, 0.35, 1.0);
	this.colorDark = new Color(-0.35, -0.35, -0.35, 1.0);
	this.additionalColor = new Color(0.0, 0.0, 0.0, 1.0);
	this.sineStep = 0;
	this.sineStepMax = 120;
	this.sinePeak = 0.35;
	this.sineStepLength = Math.PI * 2 / this.sineStepMax;
	this.touched = false;
}

BenefitPoint.prototype = new TouchPoint();
BenefitPoint.prototype.constructor = BenefitPoint;

BenefitPoint.prototype.testHit = function(object)
{
	if (object instanceof Player)
	{
		return this.bounding.intersects(object.bounding);
	}
}

BenefitPoint.prototype.onHit = function(object)
{
	if (object instanceof Player)
	{
		this.touched = true;
		this.colorFrame = 0;
	}
	return false;
}

BenefitPoint.prototype.onRender = function(webgl)
{
	if (this.mapReference)
	{
		webgl.drawPrimitive(this.bounding.outerBounding(),
			this.mapReference.view,
			this.texture,
			this.additionalColor);
	}
}

BenefitPoint.prototype.updateState = function()
{
	if (! this.touched)
	{
		var addition = Math.sin(this.sineStep * this.sineStepLength) * this.sinePeak;
		this.additionalColor.r = this.colorMean.r + addition;
		this.additionalColor.g = this.colorMean.g + addition;
		this.additionalColor.b = this.colorMean.b + addition;
		this.sineStep = (this.sineStep + 1) % this.sineStepMax;
	}
	else
	{
		this.additionalColor.deepCopy(this.colorDark);
	}
}

// end of BenefitPoint.js


/***
* RecoveryPoint.js
* Version 1.0.0
* Last Modified 2018/01/18
***/

function RecoveryPoint(config)
{
	TouchPoint.call(this, config);
	
	this.colorMean = new Color(0.35, 0.35, 0.35, 1.0);
	this.colorDark = new Color(-0.35, -0.35, -0.35, 1.0);
	this.additionalColor = new Color(0.0, 0.0, 0.0, 1.0);
	this.sineStep = 0;
	this.sineStepMax = 120;
	this.sinePeak = 0.35;
	this.sineStepLength = Math.PI * 2 / this.sineStepMax;
	this.touched = false;
}

RecoveryPoint.prototype = new TouchPoint();
RecoveryPoint.prototype.constructor = RecoveryPoint;

RecoveryPoint.prototype.testHit = function(object)
{
	if (object instanceof Player)
	{
		return this.bounding.intersects(object.bounding);
	}
}

RecoveryPoint.prototype.onHit = function(object)
{
	if (object instanceof Player)
	{
		this.touched = true;
		this.colorFrame = 0;
	}
	return false;
}

RecoveryPoint.prototype.onRender = function(webgl)
{
	if (this.mapReference)
	{
		webgl.drawPrimitive(this.bounding.outerBounding(),
			this.mapReference.view,
			this.texture,
			this.additionalColor);
	}
}

RecoveryPoint.prototype.updateState = function()
{
	if (! this.touched)
	{
		var addition = Math.sin(this.sineStep * this.sineStepLength) * this.sinePeak;
		this.additionalColor.r = this.colorMean.r + addition;
		this.additionalColor.g = this.colorMean.g + addition;
		this.additionalColor.b = this.colorMean.b + addition;
		this.sineStep = (this.sineStep + 1) % this.sineStepMax;
	}
	else
	{
		this.additionalColor.deepCopy(this.colorDark);
	}
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
* Version 1.2.3
* Last Modified 2018/01/18
***/

// WebGL wrapper for convenience
function WebGL(canvas)
{
	this.gl = null;
	this.view = Rect.makeRect();
	
	this.vertexShader = null;
	this.fragmentShader = null;
	this.shaderProgram = null;
	
	this.dataBuffer = null;
	this.arrayData = null;
	
	this.textureID = null;
	
	this.init(canvas);
}

WebGL.prototype.init = function(canvas)
{
	if (! canvas)
	{
		return;
	}
	
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
	
	try
	{
		// Create a data buffer for WebGL.
		this.dataBuffer = this.gl.createBuffer();
		// Set data array buffer to current.
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.dataBuffer);
		// Make enough space.
		this.gl.bufferData(this.gl.ARRAY_BUFFER, 1024, this.gl.STATIC_DRAW);
		
		// Create a texture.
		this.textureID = this.gl.createTexture();
		
		// Enable color mixture.
		this.gl.enable(this.gl.BLEND);
		// Enable "transparent".
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
	}
	catch (e)
	{
		console.log(e.message);
	}
	
	this.arrayData = 
	{
		data : new Array(54),
		vSize : 9,	// 0-2: Position; 3-4: Texture coordinates; 5-8: Additional color
		vCount : 6,
		bytes : 36,
		primitiveType : this.gl.TRIANGLES,
	}
	for (let i = 0; i < this.arrayData.data.length; i++)
	{
		this.arrayData.data[i] = 0;
	}
	
	this.arrayData.data[3] = 0.0;
	this.arrayData.data[4] = 0.0;
	
	this.arrayData.data[12] = 1.0;
	this.arrayData.data[13] = 0.0;
	
	this.arrayData.data[21] = 0.0;
	this.arrayData.data[22] = 1.0;
	
	this.arrayData.data[30] = 0.0;
	this.arrayData.data[31] = 1.0;
	
	this.arrayData.data[39] = 1.0;
	this.arrayData.data[40] = 0.0;
	
	this.arrayData.data[48] = 1.0;
	this.arrayData.data[49] = 1.0;
	
	try
	{
		// Compile shaders.
		this.compileDefaultShaderProgram();
		// Set runtime values of "attributes" in shaders.
		// Must before shader program linking.
		
		// Link and set shader program.
		this.linkShaderProgram();
		// Tell WebGL which shader program to use.
		this.gl.useProgram(this.shaderProgram);
	}
	catch (e)
	{
		console.log(e.message);
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
	"    attribute vec2 aTextureCoord;" +
	"    varying vec2 vTextureCoord;" +
	"    attribute vec4 aAdditionColor;" +
	"    varying vec4 vAdditionColor;" +
    "    void main(void)"+
	"    {" +
    "        gl_Position = vec4(v3Position, 1.0);" +
	"        vTextureCoord = aTextureCoord;" +
	"        vAdditionColor = aAdditionColor;" +
    "    }";
	var fragmentShaderSource =
	"    precision mediump float;" +
	"    uniform sampler2D uSampler;" +
	"    varying vec2 vTextureCoord;" +
	"    varying vec4 vAdditionColor;" +
    "    void main(void)" +
	"    {" +
    "        gl_FragColor = texture2D(uSampler," +
	"            vec2(vTextureCoord.s, vTextureCoord.t))" +
	"            + vAdditionColor;" +
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

WebGL.prototype.makeArrayData = function(box, view, additionalColor)
{
	if (!(box instanceof Rect) || !(view instanceof Rect))
	{
		return false;
	}
	
	var gl = this.gl;
	
	var xOffset = -1;
	var yOffset = 1;
	var xStretch = 2 / view.width;
	var yStretch = -2 / view.height;
	
	var corners = [box.topLeft(), box.topRight(),
				box.bottomLeft(), box.bottomRight()];
				
	var color = additionalColor? additionalColor : Color.makeColor();
	
	for (let i = 0; i < corners.length; i++)
	{
		corners[i].x = (corners[i].x - view.left) * xStretch + xOffset;
		corners[i].y = (corners[i].y - view.top) * yStretch + yOffset;
	}
	
	// Every vertex has 9 data values.6 vertexes in total.
	// So array length is 54.
	this.arrayData.data[0] = corners[0].x;
	this.arrayData.data[1] = corners[0].y;
	
	this.arrayData.data[9] = corners[1].x;
	this.arrayData.data[10] = corners[1].y;
	
	this.arrayData.data[18] = corners[2].x;
	this.arrayData.data[19] = corners[2].y;
	
	this.arrayData.data[27] = corners[2].x;
	this.arrayData.data[28] = corners[2].y;
	
	this.arrayData.data[36] = corners[1].x;
	this.arrayData.data[37] = corners[1].y;
	
	this.arrayData.data[45] = corners[3].x;
	this.arrayData.data[46] = corners[3].y;
	
	// Set additional color values.
	for (let j = 0; j < this.arrayData.vCount; j++)
	{
		this.arrayData.data[j * 9 + 5] = color.r;
		this.arrayData.data[j * 9 + 6] = color.g;
		this.arrayData.data[j * 9 + 7] = color.b;
		this.arrayData.data[j * 9 + 8] = color.a;
	}
	
	return true;
}

WebGL.prototype.image2Texture = function(image)
{
	var gl = this.gl;
	
	gl.bindTexture(gl.TEXTURE_2D, this.textureID);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

WebGL.prototype.drawPrimitive = function(box, view, image, additionalColor)
{
	if (!image || !image.src)
	{
		return;
	}
	
	var gl = this.gl;
	
	var locV3Position = 0;
	var locInTextureCoord = 0;
	var locInAdditionColor = 0;
	
	var bytes = this.arrayData.bytes;
	
	// Make array data.
    if (!this.makeArrayData(box, view, additionalColor))
	{
		return;
	}
	
	// Set data array buffer to current.
	gl.bindBuffer(gl.ARRAY_BUFFER, this.dataBuffer);
	// Copy data to WebGL buffer.
	// Attributes: target, dstByteOffset,
	// srcData, srcOffset, [length](defaulting to 0)
	gl.bufferSubData(gl.ARRAY_BUFFER, 0,
		new Float32Array(this.arrayData.data), 0);
	
	// Tell WebGL to use this array buffer to draw!
	gl.bindBuffer(gl.ARRAY_BUFFER, this.dataBuffer);
	
	// Tell WebGL how to explain the data array.
	locV3Position = gl.getAttribLocation(this.shaderProgram, "v3Position");
	locInTextureCoord = gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
	locInAdditionColor = gl.getAttribLocation(this.shaderProgram, "aAdditionColor");
    // Attributes: positionIndex, size, type, normalized, stride(interval), offset
	gl.vertexAttribPointer(locV3Position, 3, gl.FLOAT, false, bytes, 0);
	gl.vertexAttribPointer(locInTextureCoord, 2, gl.FLOAT, false, bytes, 12);
	gl.vertexAttribPointer(locInAdditionColor, 4, gl.FLOAT, false, bytes, 20);
	// Enable the array data to be used.
	gl.enableVertexAttribArray(locV3Position);
	gl.enableVertexAttribArray(locInTextureCoord);
	gl.enableVertexAttribArray(locInAdditionColor);

	// Use texture.
	this.image2Texture(image);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.textureID);
	gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "uSampler"), 0);

    // Final draw.
	// Attributes: mode, first, count
	gl.drawArrays(this.arrayData.primitiveType, 0, this.arrayData.vCount);
}

// end of WebGL.js


/***
* GameViewer.js
* Version 1.3.0
* Last Modified 2018/01/18
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
	
	this.backgroundColor = new Color(0.1, 0.1, 0.1, 1.0);
	
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
	
	this.sceneDone = false;
	this.gameOver = false;
}

GameViewer.prototype.onMouseEvent = function(e)
{
    console.log("In GameViewer MouseEvent");

}

GameViewer.prototype.onKeyBoardEvent = function(e)
{
    console.log("In GameViewer KeyBoardEvent");
	
	var keyCode = 0;
	var keyChar = 0;
	
	if (window.event)	// IE
	{
		keyCode = e.keyCode;
	}
	else if (e.which)	// Netscape,Firefox,Opera,etc.
	{
		keyCode = e.which;
	}
	
    if (keyCode === 27)
	{
        console.log("Esc");
        this.doGameOver();
        this.gameOver = true;
    }
	// Testing code for scrolling view
	else
	{
		keyChar = String.fromCharCode(keyCode)
		
		if (keyChar == "W")
		{
			this.scrollView(0, -10);
		}
		else if (keyChar == "A")
		{
			this.scrollView(-10, 0);
		}
		else if (keyChar == "S")
		{
			this.scrollView(0, 10);
		}
		else if (keyChar == "D")
		{
			this.scrollView(10, 0);
		}
	}
	// End of testing code.
}

GameViewer.prototype.isSceneDone = function()
{
    return this.sceneDone;
}

GameViewer.prototype.doScene = function()
{
    //Some process between two scenes

    this.setSceneState(false);
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
}

GameViewer.prototype.collisionDetection = function()
{
	var currentMap = this.getCurrentMap();
    if (currentMap)
    {
        currentMap.processObjectHits();
    }
}

GameViewer.prototype.updateFrame = function()
{
    //update objects actions here and return true
	var currentMap = this.getCurrentMap();
	if (currentMap)
	{
		currentMap.updateObjectStates();
		return true;
	}
    return false;
}

GameViewer.prototype.onRender = function()
{
	var currentMap = this.getCurrentMap();
	this.drawBackground();
	if (currentMap)
	{
		currentMap.onRender(this.webGL);
		return true;
	}
	return false;
}

GameViewer.prototype.drawBackground = function()
{
	this.webGL.clearScreen(this.backgroundColor);
}

GameViewer.prototype.viewAtBirthPlace = function()
{
	var currentMap = this.getCurrentMap();
	if (currentMap)
	{
		currentMap.viewAtBirthPlace();
	}
}

GameViewer.prototype.viewAt = function(point)
{
	var currentMap = this.getCurrentMap();
	if (currentMap)
	{
		currentMap.viewAt(point);
	}
}

GameViewer.prototype.scrollView = function(offsetX, offsetY)
{
	var currentMap = this.getCurrentMap();
	if (currentMap)
	{
		currentMap.scrollView(offsetX, offsetY);
	}
}

GameViewer.prototype.setViewTopLeft = function(x, y)
{
	var currentMap = this.getCurrentMap();
	if (currentMap)
	{
		currentMap.setViewTopLeft(x, y);
	}
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
		this.viewAtBirthPlace();
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
* Version 1.4.0
* Last Modified 2018/01/18
***/

window.onload = function(event)
{
	new Main(event);
}

function Main(event)
{
	Main.instance = this;
	
	this.requestAnimationFrameId = 0;
    this.frameCount = 0;
	this.exitFlag = false;

    this.init(event);

    console.log("In Main");

    this.MessageQueue = new Queue();

    this.plotManager = new PlotManager();

    this.config = new Configuration("assets/config/config.xml");
	this.gameMapIDs = ["sceneStart", "scene1", "scene2", "scene2-1",
		"scene2-2", "scene3", "scene4", "sceneFinal"];
	
	this.gameViewer = new GameViewer(this.config);
	this.gameViewer.addMaps(this.gameMapIDs);
	this.gameViewer.setCurrentMap(this.gameMapIDs[0]);
	
	console.log(this.gameViewer);

    //Enter the Game Loop
    this.requestAnimationFrameId = requestAnimationFrame(this.gameLoop);
}

Main.prototype.gameLoop = function()
{
    var main = Main.instance;
	console.log("In Game Loop:%d", main.frameCount);
	
    main.frameCount++;
	if (main.exitFlag === true)
	{
		return;
	}
    if (main.MessageQueue.size() !== 0)
	{
		var e = null;
        while(main.MessageQueue.size() !== 0)
		{
            e = main.MessageQueue.front();
            if (e instanceof MouseEvent)
			{
				main.gameViewer.onMouseEvent(e);
			}
            else if (e instanceof KeyboardEvent)
			{
				main.gameViewer.onKeyBoardEvent(e);
			}
            main.MessageQueue.pop();
        }
    }
    if (main.gameViewer.updateFrame() === false)
	{
        main.exit();
    }
    main.gameViewer.collisionDetection();
    if (main.gameViewer.onRender() === false)
	{
        main.exit();
    }
    if (main.gameViewer.isSceneDone() === true)
	{
        main.gameViewer.doScene();
    }
    console.log(main.gameViewer.isGameOver());
    if (main.gameViewer.isGameOver() === true)
	{
        console.log("isGameOver === true");
        main.exit();
    }
	else
	{
        main.requestAnimationFrameId = requestAnimationFrame(main.gameLoop);
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

Main.prototype.exit = function()
{
	var main = Main.instance;
    console.log("In Exit Function");
	main.exitFlag = true;
    cancelAnimationFrame(main.requestAnimationFrameId);
    main.cleanUp();
	window.location.href = "index.html";
}

Main.prototype.onMouseDown = function(event)
{
	var main = Main.instance;
    //console.log("on mouse down");
    //console.log(event instanceof MouseEvent);
    main.MessageQueue.push(event);
}

Main.prototype.onLeftButton = function(event)
{
    console.log("on left button ");
    //main.MessageQueue.push(event);
}

Main.prototype.onRightButton = function(event)
{
    console.log("on right button ");
    //main.MessageQueue.push(event);
}

Main.prototype.onKeyDown = function(event)
{
	var main = Main.instance;
    main.MessageQueue.push(event);
}

// Queue for message loop.

function Queue()
{
    this.queue = [];
}

Queue.prototype.push = function(item)
{
    this.queue.push(item);
}

Queue.prototype.front = function()
{
    if (this.queue.length > 0)
	{
		return this.queue[0];
	}
    else
	{
		return null;
	}
}

Queue.prototype.pop = function()
{
    this.queue.shift();
}

Queue.prototype.size = function()
{
    return this.queue.length;
}

// end of Main.js
