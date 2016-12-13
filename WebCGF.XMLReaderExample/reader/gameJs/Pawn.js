/**
* Pawn
* @constructor
*/
function Pawn(scene, texture) {
	CGFobject.call(this,scene);

	this.body = new Cylinder(scene, 0.5,0.5,1,10,10);

};

Pawn.prototype = Object.create(CGFobject.prototype);
Pawn.prototype.constructor = Pawn;


Pawn.prototype.display = function() {

	this.scene.pushMatrix();

  this.body.display();

	this.scene.popMatrix();
}
