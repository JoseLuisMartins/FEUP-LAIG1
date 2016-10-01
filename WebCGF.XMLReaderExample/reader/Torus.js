/**
 * Torus
 * @constructor
 */
 function Torus(scene, inner, outer, slices, loops) {
 	CGFobject.call(this,scene);

    this.r = inner;
    this.R = outer;
	this.slices = slices;
	this.stacks = loops;

	this.textS = 1.0 / this.slices;
    this.textT = 1.0 / this.stacks;
 	this.initBuffers();
 };

 Torus.prototype = Object.create(CGFobject.prototype);
 Torus.prototype.constructor = Torus;

 Torus.prototype.initBuffers = function() {

	this.vertices = new Array();
	this.indices = new Array();
	this.normals = new Array();
	this.texCoords = new Array();


	var hor_ang = (2*Math.PI) / this.slices;
	var ver_ang = (2*Math.PI) / this.stacks;
	var rect = Math.PI / 2;

	for (i = 0; i < this.slices; i++) {
		var x = (this.R + this.r * Math.cos(i*hor_ang)) * Math.cos(rect);
		var y = (this.R + this.r * Math.cos(i*hor_ang)) * Math.sin(rect);
		var z = this.r * Math.sin(i*hor_ang);
		var s = Math.asin(x)/Math.PI + 0.5;
		var t = Math.asin(y)/Math.PI + 0.5;

		this.vertices.push(x, y, z);
		this.normals.push(x, y, z);
		this.texCoords.push(s, t);
	}


	var top = this.slices;
	var bottom = 0;

	for (k = 1; k <= this.stacks; k++) {

		var x = (this.R + this.r * Math.cos(0)) * Math.cos(rect - k*ver_ang);
		var y = (this.R + this.r * Math.cos(0)) * Math.sin(rect - k*ver_ang);
		var z = this.r * Math.sin(i*hor_ang);
		var s = Math.asin(x)/Math.PI + 0.5;
		var t = Math.asin(y)/Math.PI + 0.5;

		this.vertices.push(x, y, z);
		this.normals.push(x, y, z);
		this.texCoords.push(s, t);

		for (i = 1; i < this.slices; i++) {

			x = (this.R + this.r * Math.cos(i*hor_ang)) * Math.cos(rect - k*ver_ang);
			y = (this.R + this.r * Math.cos(i*hor_ang)) * Math.sin(rect - k*ver_ang);
			z = this.r * Math.sin(i*hor_ang);
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
