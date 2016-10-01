/**
* CylinderSurface
* @constructor
*/
function CylinderSurface(scene, slices, stacks) {
	CGFobject.call(this,scene);

	this.slices = slices;
	this.stacks = stacks;

	this.patchSlices = 1 / this.slices;
	this.patchStacks = 1 / this.stacks;

	this.initBuffers();
};

CylinderSurface.prototype = Object.create(CGFobject.prototype);
CylinderSurface.prototype.constructor = CylinderSurface;

CylinderSurface.prototype.initBuffers = function() {


	this.vertices = new Array();
	this.indices = new Array();
	this.normals = new Array();
	this.texCoords = new Array();


	var ang = (2*Math.PI) / this.slices;

	var s = 0;
	var t = 0;

	for (i = 0; i < this.slices; i++) {
		this.vertices.push(Math.cos(i*ang), Math.sin(i*ang), 0);
		this.normals.push(Math.cos(i*ang), Math.sin(i*ang), 0);

		this.texCoords.push(s, t);
		s += this.patchSlices;
	}


	var top = this.slices;
	var bottom = 0;

	for (k = 1; k <= this.stacks; k++) {

		s = 0;
		t += this.patchStacks;

		this.vertices.push(Math.cos(0), Math.sin(0), k/this.stacks);
		this.normals.push(Math.cos(0), Math.sin(0), 0.0);
		this.texCoords.push(s, t);

		for (i = 1; i < this.slices; i++) {

			s += this.patchSlices;

			this.vertices.push(Math.cos(i*ang), Math.sin(i*ang), k/this.stacks);
			this.normals.push(Math.cos(i*ang), Math.sin(i*ang), 0.0);
			this.texCoords.push(s, t);

			this.indices.push(top);
			this.indices.push(bottom+1);
			this.indices.push(top+1);
			this.indices.push(bottom);
			this.indices.push(bottom+1);
			this.indices.push(top);

			top++;
			bottom++;
		}

		top++;
		bottom++;

		this.indices.push(top - 1, bottom - this.slices, top - this.slices);
		this.indices.push(bottom - 1, bottom - this.slices, top - 1);
	}


	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
