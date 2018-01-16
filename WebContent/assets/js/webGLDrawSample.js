// WebGL draw sample

WebGL.prototype.drawPrimitive = function(shape)
{
	var gl = this.gl;
	
	var square = null;
    // Create a data buffer for WebGL.
	var vertexBuffer = gl.createBuffer();
	// Make array data.
    var vertexes =
	[
        .5, .5, 0.0,
        -.5, .5, 0.0,
        .5, -.5, 0.0,
        -.5, -.5, 0.0,
		.5, -.5, 0.0,
        -.5, .5, 0.0,
    ];
	
	square =
	{
		buffer : vertexBuffer,
		vertSize : 3,
		nVerts : 6,
		primtype : gl.TRIANGLES,
	};

	// Compile shaders.
	this.compileDefaultShaderProgram();
    // Set runtime values of "attributes" in shaders.
	// Must before shader program linking.
	gl.bindAttribLocation(this.shaderProgram, 0, "v3Position");
	// Link and set shader program.
	this.linkShaderProgram();
	// Tell WebGL which shader program to use.
	gl.useProgram(this.shaderProgram);
	
	// Set data array buffer to current.
	gl.bindBuffer(gl.ARRAY_BUFFER, square.buffer);
	// Copy data to WebGL buffer.
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexes), gl.STATIC_DRAW);
	
	// Tell WebGL to use this array buffer to draw!
	gl.bindBuffer(gl.ARRAY_BUFFER, square.buffer);
	// Enable the array data to be used.
	gl.enableVertexAttribArray(0);
	// Tell WebGL how to explain the data array.
	// Attributes: positionIndex, size, type, normalized, stride(interval), offset
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    // Final draw.
	// Attributes: mode, first, count
	gl.drawArrays(square.primtype, 0, square.nVerts);
}