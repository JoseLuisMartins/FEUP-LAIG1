/**
* Pawn
* @constructor
*/
function Pawn(scene, texture,identifier) {
	CGFobject.call(this,scene);

	this.body = new Cylinder(scene, 0.5,0.5,1,10,10);
	this.identifier=identifier;

	this.x=0;
	this.y=0;

	this.material = new CGFappearance(scene);
	this.material.setTexture(new CGFtexture(scene, texture));
};

Pawn.prototype = Object.create(CGFobject.prototype);
Pawn.prototype.constructor = Pawn;


Pawn.prototype.display = function() {

	this.scene.pushMatrix();

	this.material.apply();
  this.body.display();

	this.scene.popMatrix();
}
