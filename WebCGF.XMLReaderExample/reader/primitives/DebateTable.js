/**
* DebateTable
* @constructor
*/
function DebateTable(scene) {
	CGFobject.call(this, scene);

	this.cube = new Cube(scene);
    this.board = new Rectangle(scene, new Point3(-3, 1), new Point3(3, 4));
    this.holder = new Cylinder(scene, 0.1, 0.1, 1, 40, 40);

    this.whiteAppearance = new CGFappearance(scene);
	this.whiteAppearance.loadTexture("resources\\images\\marble.jpg");
    this.whiteAppearance.setAmbient(1, 1, 1, 1);
    this.whiteAppearance.setDiffuse(0, 1, 1, 0.5);

    this.blackAppearance = new CGFappearance(scene);
	this.blackAppearance.loadTexture("resources\\images\\black.jpg");
    this.blackAppearance.setAmbient(1, 1, 1, 1);
    this.blackAppearance.setDiffuse(1, 1, 1, 0.5);
    this.blackAppearance.setSpecular(1, 1, 1, 0.5);

    this.boardAppearance = new CGFappearance(scene);
	this.boardAppearance.loadTexture("resources\\images\\blockade.jpg");
    this.boardAppearance.setAmbient(1, 1, 1, 1);
    this.boardAppearance.setDiffuse(1, 1, 1, 0.5);
    this.boardAppearance.setSpecular(1, 1, 1, 0.5);
}

DebateTable.prototype = Object.create(CGFobject.prototype);
DebateTable.prototype.constructor = DebateTable;


DebateTable.prototype.display = function() {

    this.whiteAppearance.apply();    
    this.scene.pushMatrix();
        this.scene.translate(-3, 0, 2);
        this.scene.rotate(-Math.PI/4, 0, 1, 0);
        this.scene.scale(1, 2, 4);
        this.cube.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.scale(2, 2, 2);
        this.scene.translate(0, 0, 0.5);
        this.cube.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(3, 0, 2);
        this.scene.rotate(Math.PI/4, 0, 1, 0);
        this.scene.scale(1, 2, 4);
        this.cube.display();
    this.scene.popMatrix();

    this.boardAppearance.apply();
    this.scene.pushMatrix();
        this.scene.translate(0, 0, -8);
        this.board.display();
    this.scene.popMatrix();

    this.blackAppearance.apply();
    this.scene.pushMatrix();
        this.scene.translate(0, 0, -8);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.holder.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(-3, 1, 2);
        this.scene.rotate(-Math.PI/4, 0, 1, 0);
        this.scene.scale(0.8, 0.1, 3.8);
        this.cube.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(3, 1, 2);
        this.scene.rotate(Math.PI/4, 0, 1, 0);
        this.scene.scale(0.8, 0.1, 3.8);
        this.cube.display();
    this.scene.popMatrix();
};