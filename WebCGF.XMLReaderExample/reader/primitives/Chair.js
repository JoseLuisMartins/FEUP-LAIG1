/**
* Chair
* @constructor
*/
function Chair(scene) {
	CGFobject.call(this, scene);

    this.obj = new Cube(scene);
}

Chair.prototype = Object.create(CGFobject.prototype);
Chair.prototype.constructor = Chair;


Chair.prototype.display = function() {
    //this.scene.translate(0, 0, 0.5);

    // Legs
    this.scene.pushMatrix();
        this.scene.translate(-0.5, -0.5, 0);
        this.scene.scale(0.1, 0.1, 1);
        this.obj.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0.5, -0.5, 0);
        this.scene.scale(0.1, 0.1, 1);
        this.obj.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(-0.5, 0.5, 0);
        this.scene.scale(0.1, 0.1, 1);
        this.obj.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0.5, 0.5, 0);
        this.scene.scale(0.1, 0.1, 1);
        this.obj.display();
    this.scene.popMatrix();
    // *************


    this.scene.translate(0, 0, 0.5);

    // Sit
    this.scene.pushMatrix();
        this.scene.scale(1.1, 1.1, 0.1);
        this.obj.display();
    this.scene.popMatrix();


    // Back
    this.scene.pushMatrix();
        this.scene.translate(-0.5, 0.525, 0.4);
        this.scene.scale(0.1, 0.05, 1);
        this.obj.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, 0.525, 0.4);
        this.scene.scale(0.2, 0.05, 0.9);
        this.obj.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0.5, 0.525, 0.4);
        this.scene.scale(0.1, 0.05, 1);
        this.obj.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, 0.525, 0.9);
        this.scene.scale(1.1, 0.05, 0.1);
        this.obj.display();
    this.scene.popMatrix();
};