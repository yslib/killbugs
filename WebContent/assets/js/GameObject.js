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

