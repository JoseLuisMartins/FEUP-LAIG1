/**
* SquareTable
* @constructor
*/
function SquareTable(scene) {
	CGFobject.call(this, scene);

	this.top = new Cube(scene);
    this.leg = new Cylinder(scene, 0.05, 0.05, 1.2, 40, 40);
}

SquareTable.prototype = Object.create(CGFobject.prototype);
SquareTable.prototype.constructor = SquareTable;


SquareTable.prototype.display = function() {

	this.scene.pushMatrix();
		this.scene.translate(0, 0, 1.2);
        this.scene.scale(1.2, 1.2, 0.1);
		this.top.display();
	this.scene.popMatrix();

    this.scene.pushMatrix();
		this.scene.translate(-0.5, -0.5, 0);
		this.leg.display();
	this.scene.popMatrix();

    this.scene.pushMatrix();
		this.scene.translate(0.5, -0.5, 0);
		this.leg.display();
	this.scene.popMatrix();

    this.scene.pushMatrix();
		this.scene.translate(-0.5, 0.5, 0);
		this.leg.display();
	this.scene.popMatrix();

    this.scene.pushMatrix();
		this.scene.translate(0.5, 0.5, 0);
		this.leg.display();
	this.scene.popMatrix();
};