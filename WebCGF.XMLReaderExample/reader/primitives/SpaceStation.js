/**
* SpaceStation
* @constructor
*/
function SpaceStation(scene) {
	CGFobject.call(this, scene);

    this.torus = new Torus(scene, 13, 15, 40, 40);
    this.cylinder = new Cylinder(scene, 0.1, 0.1, 13, 40, 40);
    this.holder = new Cylinder(scene, 0.5, 0.5, 2, 40, 40);
    this.platform = new Cylinder(scene, 4, 4, 1, 5, 5);

    this.torusAppearance = new CGFappearance(scene);
    this.torusAppearance.setAmbient(1, 1, 1, 1);
	this.torusAppearance.loadTexture("resources\\images\\space_station.jpg");

    this.cylinderAppearance = new CGFappearance(scene);
    this.cylinderAppearance.setAmbient(1, 1, 1, 1);
	this.cylinderAppearance.loadTexture("resources\\images\\metal.jpg");

    this.platformAppearance = new CGFappearance(scene);
    this.platformAppearance.setAmbient(1, 1, 1, 1);
	this.platformAppearance.loadTexture("resources\\images\\blue.jpg");
}

SpaceStation.prototype = Object.create(CGFobject.prototype);
SpaceStation.prototype.constructor = SpaceStation;


SpaceStation.prototype.display = function() {

    this.torusAppearance.apply();
    this.torus.display();

    this.cylinderAppearance.apply();
    for (var i = 0; i < 5; i++) {
        var angle = i * (Math.PI/2.5);
        this.scene.pushMatrix();
            this.scene.rotate(angle, 0, 0, 1);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
            this.cylinder.display();
        this.scene.popMatrix();
    }
    
    this.holder.display();

    this.platformAppearance.apply();
    this.scene.pushMatrix();
        this.scene.translate(0, 0, 2);
        this.platform.display();
    this.scene.popMatrix();
};