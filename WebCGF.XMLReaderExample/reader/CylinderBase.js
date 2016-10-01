/**
* CylinderBase
* @constructor
*/
function CylinderBase(scene, slices) {
	CGFobject.call(this,scene);

	this.slices = slices;

	this.initBuffers();
};

CylinderBase.prototype = Object.create(CGFobject.prototype);
CylinderBase.prototype.constructor = CylinderBase;

CylinderBase.prototype.initBuffers = function() {


	this.vertices = new Array();
	this.indices = new Array();
	this.normals = new Array();
	this.texCoords = new Array();


	var ang = (2*Math.PI) / this.slices;
	var start = 1;

	this.vertices.push(0, 0, 0);
	this.normals.push(0, 0, 1);
	this.texCoords.push(0.5, 0.5);

	for (i = 0; i <= this.slices; i++) {
		var x = Math.cos(i*ang);
		var y = Math.sin(i*ang);

		this.vertices.push(x, y, 0);
		this.normals.push(0, 0, 1);

		this.texCoords.push(0.5 + 0.5 * x, 0.5 - 0.5 * y);

		if (i > 1) {
			this.indices.push(start++, start, 0);
		}
	}

	this.indices.push(0, start, 1);


	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
