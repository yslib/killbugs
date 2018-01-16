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

