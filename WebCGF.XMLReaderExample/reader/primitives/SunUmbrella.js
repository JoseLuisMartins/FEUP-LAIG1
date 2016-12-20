/**
* SunUmbrella
* @constructor
*/
function SunUmbrella(scene) {
	CGFobject.call(this, scene);

	this.top = new Cylinder(scene, 3, 0, 1, 40, 40);
    this.body = new Cylinder(scene, 0.1, 0.1, 3, 40, 40);
}

SunUmbrella.prototype = Object.create(CGFobject.prototype);
SunUmbrella.prototype.constructor = SunUmbrella;


SunUmbrella.prototype.display = function() {

	this.body.display();

	this.scene.pushMatrix();
		this.scene.translate(0, 0, 3);
		this.top.display();
	this.scene.popMatrix();
};