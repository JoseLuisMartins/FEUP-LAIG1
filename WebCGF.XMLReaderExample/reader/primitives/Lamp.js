/**
* Lamp
* @constructor
*/
function Lamp(scene) {
	CGFobject.call(this,scene);
    
	this.body = new Cylinder(scene, 0.05, 0.05, 1, 40, 40);
    this.lamp = new CylinderTwoSidedSurface(scene, 0.1, 0.5, 0.7, 40, 40);
    this.link = new Torus(scene, 0.04, 0.075, 40, 40);
}

Lamp.prototype = Object.create(CGFobject.prototype);
Lamp.prototype.constructor = Lamp;


Lamp.prototype.display = function() {
    this.scene.pushMatrix();
        this.scene.scale(1, 1, 3);
	    this.body.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, 0, 3);
        this.scene.rotate(Math.PI/6, 1, 0, 0);
	    this.link.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, 0, 3);
        this.scene.rotate(Math.PI/4, 1, 0, 0);
	    this.body.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, -Math.sqrt(2)/2, 3 + Math.sqrt(2)/2);
        this.scene.rotate(Math.PI/3, 1, 0, 0);
	    this.link.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, -Math.sqrt(2)/2, 3 + Math.sqrt(2)/2);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
	    this.lamp.display();
    this.scene.popMatrix();
};