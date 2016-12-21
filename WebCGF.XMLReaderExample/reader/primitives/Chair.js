/**
* Chair
* @constructor
*/
function Chair(scene, float) {
	CGFobject.call(this, scene);
    this.float = float;

    this.obj = new Cube(scene);

    if (this.float) {
        this.propellant = new Propellant(scene);
    }
}

Chair.prototype = Object.create(CGFobject.prototype);
Chair.prototype.constructor = Chair;


Chair.prototype.display = function() {
    this.scene.translate(0, 0, 0.5);

    this.scene.pushMatrix();
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
    this.scene.popMatrix();


    if (this.float) {
        this.scene.pushMatrix();
            this.scene.translate(-0.5, -0.47, -0.8);
            this.scene.scale(0.08, 0.08, 0.2);
            this.propellant.display();
	    this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.5, -0.47, -0.8);
            this.scene.scale(0.08, 0.08, 0.2);
            this.propellant.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(-0.5, 0.53, -0.8);
            this.scene.scale(0.08, 0.08, 0.2);
            this.propellant.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
            this.scene.translate(0.5, 0.53, -0.8);
            this.scene.scale(0.08, 0.08, 0.2);
            this.propellant.display();
        this.scene.popMatrix();
    }
};


Chair.prototype.update = function(currrTime) {
    if (this.float) {
        this.propellant.update();
    }
};