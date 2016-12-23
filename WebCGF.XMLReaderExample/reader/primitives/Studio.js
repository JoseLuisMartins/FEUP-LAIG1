/**
* Studio
* @constructor
*/
function Studio(scene) {
	CGFobject.call(this, scene);

    this.studio = new CylinderTwoSided(scene, 50, 50, 40, 40, 40);
    this.studioApperance = new CGFappearance(scene);
    this.studioApperance.setAmbient(1, 0, 0, 1);

    this.floor = new Cylinder(scene, 50, 40, 10, 40, 40);
    this.floorApperance = new CGFappearance(scene);
    this.floorApperance.setAmbient(0, 0, 0, 1);

    this.table = new DebateTable(scene);
    this.chair = new Chair(scene, false);
    this.lamp = new Lamp(scene);
}

Studio.prototype = Object.create(CGFobject.prototype);
Studio.prototype.constructor = Studio;


Studio.prototype.display = function() {

    this.scene.pushMatrix();
        this.scene.translate(0, 5, 10);
        this.scene.scale(3, 3, 5);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.table.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(-12, 3, 10);
        this.scene.rotate(Math.PI/4, 0, 0, 1);
        this.scene.scale(3, 3, 3);
        this.chair.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(12, 3, 10);
        this.scene.rotate(-Math.PI/4, 0, 0, 1);
        this.scene.scale(3, 3, 3);
        this.chair.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, 8, 10);
        this.scene.scale(3, 3, 3);
        this.chair.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(-20, -20, 10);
        this.scene.rotate(Math.PI/1.2, 0, 0, 1);
        this.scene.scale(3, 3, 3);
        this.lamp.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(20, -20, 10);
        this.scene.rotate(-Math.PI/1.2, 0, 0, 1);
        this.scene.scale(3, 3, 3);
        this.lamp.display();
    this.scene.popMatrix();

    this.studioApperance.apply();
	//this.studio.display();

    this.floorApperance.apply();
    this.floor.display();
};