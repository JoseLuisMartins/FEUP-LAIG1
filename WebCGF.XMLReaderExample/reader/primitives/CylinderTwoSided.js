/**
* CylinderTwoSided
* @constructor
*/
function CylinderTwoSided(scene, base, top, height, slices, stacks) {
	CGFobject.call(this,scene);
	this.heigth=height;
	this.surface = new CylinderTwoSidedSurface(scene, base, top, height, slices, stacks);
	this.base = new CylinderBase(scene, base, slices);
	this.top = new CylinderBase(scene, top, slices);
};

CylinderTwoSided.prototype = Object.create(CGFobject.prototype);
CylinderTwoSided.prototype.constructor = CylinderTwoSided;


CylinderTwoSided.prototype.display = function() {

	this.surface.display();

	this.scene.pushMatrix();
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.base.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.base.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0, 0, this.heigth);
		this.top.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0, 0, this.heigth);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.top.display();
	this.scene.popMatrix();
}