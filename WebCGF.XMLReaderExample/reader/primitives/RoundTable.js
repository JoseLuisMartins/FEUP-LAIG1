/**
* RoundTable
* @constructor
*/
function RoundTable(scene) {
	CGFobject.call(this, scene);

	this.top = new Cylinder(scene, 1, 1, 0.2, 40, 40);
    this.leg = new Cylinder(scene, 0.1, 0.1, 1.2, 40, 40);
    this.base = new Cylinder(scene, 0.5, 0.1, 0.1, 40, 40);
}

RoundTable.prototype = Object.create(CGFobject.prototype);
RoundTable.prototype.constructor = RoundTable;


RoundTable.prototype.display = function() {

	this.leg.display();
    this.base.display();

	this.scene.pushMatrix();
		this.scene.translate(0, 0, 1.2);
		this.top.display();
	this.scene.popMatrix();
};