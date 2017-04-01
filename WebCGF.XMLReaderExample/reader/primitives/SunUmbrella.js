/**
* SunUmbrella
* @constructor
*/
function SunUmbrella(scene) {
	CGFobject.call(this, scene);

	this.top = new CylinderTwoSidedSurface(scene, 3, 0, 1, 40, 40);
    this.body = new Cylinder(scene, 0.1, 0.1, 3.9, 40, 40);

	this.bottomAppearance = new CGFappearance(scene);
	this.bottomAppearance.loadTexture("resources\\images\\wood_light.jpg");

	this.topAppearance = new CGFappearance(scene);
	this.topAppearance.loadTexture("resources\\images\\sun_umbrella_top.jpg");
}

SunUmbrella.prototype = Object.create(CGFobject.prototype);
SunUmbrella.prototype.constructor = SunUmbrella;


SunUmbrella.prototype.display = function() {
	
	this.bottomAppearance.apply();
	this.body.display();

	this.topAppearance.apply();
	this.scene.pushMatrix();
		this.scene.translate(0, 0, 3);
		this.top.display();
	this.scene.popMatrix();
};