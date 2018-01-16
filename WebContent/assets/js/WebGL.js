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

