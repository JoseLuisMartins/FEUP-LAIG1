/**
 * Sphere
 * @constructor
 */
 function Sphere(scene, slices, stacks) {
 	CGFobject.call(this,scene);

	this.slices = slices;
	this.stacks = stacks;

	this.textS = 1.0 / this.slices;
  this.textT = 1.0 / this.stacks;
 	this.initBuffers();
 };

 Sphere.prototype = Object.create(CGFobject.prototype);
 Sphere.prototype.constructor = Sphere;

 Sphere.prototype.initBuffers = function() {

	this.vertices = new Array();
	this.indices = new Array();
	this.normals = new Array();
	this.texCoords = new Array();


	var hor_ang = (2*Math.PI) / this.slices;
	var ver_ang = (2*Math.PI) / this.stacks;
	var rect = Math.PI / 2;

	for (i = 0; i < this.slices; i++) {
		var x = Math.sin(rect)*Math.cos(i*hor_ang);
		var y = Math.sin(rect)*Math.sin(i*hor_ang);
		var z = Math.cos(rect);
		var s = Math.asin(x)/Math.PI + 0.5;
		var t = Math.asin(y)/Math.PI + 0.5;

		this.vertices.push(x, y, z);
		this.normals.push(x, y, z);
		this.texCoords.push(s, t);
	}


	var top = this.slices;
	var bottom = 0;

	for (k = 1; k <= this.stacks; k++) {

		var x = Math.sin(rect - k*ver_ang)*Math.cos(0);
		var y = Math.sin(rect - k*ver_ang)*Math.sin(0);
		var z = Math.cos(rect - k*ver_ang);
		var s = Math.asin(x)/Math.PI + 0.5;
		var t = Math.asin(y)/Math.PI + 0.5;

		this.vertices.push(x, y, z);
		this.normals.push(x, y, z);
		this.texCoords.push(s, t);

		for (i = 1; i < this.slices; i++) {

			x = Math.sin(rect - k*ver_ang)*Math.cos(i*hor_ang);
			y = Math.sin(rect - k*ver_ang)*Math.sin(i*hor_ang);
			z = Math.cos(rect - k*ver_ang);
			s = Math.asin(x)/Math.PI + 0.5;
			t = Math.asin(y)/Math.PI + 0.5;

			this.vertices.push(x, y, z);
			this.normals.push(x, y, z);
			this.texCoords.push(s,t);

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
