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

