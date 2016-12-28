/**
* Pawn
* @constructor
*/
function Pawn(scene, texture, identifier, type) {
	CGFobject.call(this,scene);

	this.scene = scene;

	this.body = new Sphere(scene, 0.33, 360, 20, 20);
	this.head = new Sphere(scene, 0.2, 360, 20, 20);
	this.nose = new Cylinder(scene, 0.02, 0, 0.1, 20, 20);
	this.eye = new Sphere (scene, 0.02, 360, 20, 20);
	this.branch = new Cylinder(scene, 0.02, 0.02, 0.2, 20, 20);
	this.hatTop = new Cylinder(scene, 0.08, 0.08, 0.15, 20, 20);
	this.hatBottom = new Torus(scene, 0.08, 0.12, 20, 20);

	this.type = type;
	this.identifier = identifier;
	this.x = 0;
	this.y = 0;

	this.material = new CGFappearance(scene);
	this.material.setTexture(new CGFtexture(scene, texture));

	this.carrot = new CGFappearance(scene);
	this.carrot.loadTexture("resources\\images\\carrot.jpg");

	this.black = new CGFappearance(scene);
	this.black.loadTexture("resources\\images\\black.jpg");
}

Pawn.prototype = Object.create(CGFobject.prototype);
Pawn.prototype.constructor = Pawn;


Pawn.prototype.display = function() {

	if (this.type == "yellow") {
		this.scene.rotate(Math.PI, 0, 0, 1);
	}

	this.carrot.apply();
	this.scene.pushMatrix();
		this.scene.translate(0, 0.2, 1.2);
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
  		this.nose.display();
	this.scene.popMatrix();

	this.black.apply();
	this.scene.pushMatrix();
		this.scene.translate(0, 0, 1.4);
  		this.hatTop.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0, 0, 1.4);
  		this.hatBottom.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.085, 0.16, 1.3);
		this.eye.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-0.085, 0.16, 1.3);
		this.eye.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-0.3, 0, 0.9);
		this.scene.rotate(-Math.PI/2.5, 1, 0, 0);
		this.scene.rotate(-Math.PI/2.5, 0, 1, 0);
		this.branch.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.3, 0, 0.9);
		this.scene.rotate(-Math.PI/2.5, 1, 0, 0);
		this.scene.rotate(Math.PI/2.5, 0, 1, 0);
		this.branch.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.material.apply();
		this.scene.translate(0, 0, 0.8);
  		this.body.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0, 0, 1.2);
		this.head.display();
	this.scene.popMatrix();
};
