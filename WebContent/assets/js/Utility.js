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

