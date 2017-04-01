/**
* Lamp
* @constructor
*/
function Lamp(scene) {
	CGFobject.call(this,scene);
    
	this.body = new Cylinder(scene, 0.05, 0.05, 1, 40, 40);
    this.lamp1 = new CylinderTwoSidedSurface(scene, 0.3, 0.5, 0.8, 40, 40);
    this.lamp2 = new Sphere(scene, 0.3, 180, 40, 40);
    this.lamp4 = new Sphere(scene, 0.4, 180, 40, 40);
    this.lamp3 = new Cube(scene);


    this.blackAppearance = new CGFappearance(scene);
	this.blackAppearance.loadTexture("resources\\images\\black.jpg");

    this.yellowAppearance = new CGFappearance(scene);
	this.yellowAppearance.setAmbient(1, 1, 0.5, 1);
    this.yellowAppearance.setDiffuse(1, 1, 0.8, 1);
    this.yellowAppearance.setSpecular(1, 1, 0.3, 1);


    this.metalAppearance = new CGFappearance(scene);
	this.metalAppearance.loadTexture("resources\\images\\metal2.jpg");
}

Lamp.prototype = Object.create(CGFobject.prototype);
Lamp.prototype.constructor = Lamp;


Lamp.prototype.display = function() {
    
    this.blackAppearance.apply();
    this.scene.pushMatrix();
        this.scene.scale(1, 1, 3);
	    this.body.display();
    this.scene.popMatrix();

    this.metalAppearance.apply();
    this.scene.pushMatrix();
        this.scene.translate(0, 0, 3);
        this.scene.rotate(Math.PI/1.8, 1, 0, 0);
	    this.lamp1.display();
    this.scene.popMatrix();

    this.blackAppearance.apply();
    this.scene.pushMatrix();
        this.scene.translate(0, 0, 3);
        this.scene.rotate(Math.PI + Math.PI/1.8, 1, 0, 0);
	    this.lamp2.display();
    this.scene.popMatrix();

    this.yellowAppearance.apply();
    this.scene.pushMatrix();
        this.scene.translate(0, -0.6, 2.9);
        this.scene.rotate(Math.PI/1.8, 1, 0, 0);
	    this.lamp4.display();
    this.scene.popMatrix();

    this.blackAppearance.apply();
    this.scene.pushMatrix();
        this.scene.translate(0, -1, 3 + 0.4);
        this.scene.rotate(-Math.PI/8, 1, 0, 0);
        this.scene.scale(0.4, 0.4, 0.01);
	    this.lamp3.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0.66, -0.8, 2.9);
        this.scene.rotate(-Math.PI/8, 0, 0, 1);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(0.4, 0.4, 0.01);
	    this.lamp3.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, -0.8, 3 - 0.6);
        this.scene.rotate(Math.PI/8, 1, 0, 0);
        this.scene.scale(0.4, 0.4, 0.01);
	    this.lamp3.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(-0.66, -0.8, 2.9);
        this.scene.rotate(Math.PI/8, 0, 0, 1);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(0.4, 0.4, 0.01);
	    this.lamp3.display();
    this.scene.popMatrix();
};