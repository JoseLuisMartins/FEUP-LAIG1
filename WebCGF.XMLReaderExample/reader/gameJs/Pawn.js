/**
* Pawn
* @constructor
*/
function Pawn(scene, texture, identifier,type) {
	CGFobject.call(this,scene);

	this.scene = scene;

	this.body = new Cylinder(scene, 0.5, 0.1, 1, 20, 20);
	this.head = new Sphere(scene, 0.2,360, 20, 20);

	this.type = type;
	this.identifier = identifier;
	this.x=0;
	this.y=0;

	this.material = new CGFappearance(scene);
	this.material.setTexture(new CGFtexture(scene, texture));
}

Pawn.prototype = Object.create(CGFobject.prototype);
Pawn.prototype.constructor = Pawn;


Pawn.prototype.display = function() {

	this.scene.pushMatrix();
		this.material.apply();
  		this.body.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0, 0, 1);
		this.head.display();
	this.scene.popMatrix();
};
