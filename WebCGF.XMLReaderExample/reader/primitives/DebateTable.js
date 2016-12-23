/**
* DebateTable
* @constructor
*/
function DebateTable(scene) {
	CGFobject.call(this, scene);

	this.component1 = new Cube(scene);
    this.component2 = new Cube(scene);
    this.component3 = new Cube(scene);
}

DebateTable.prototype = Object.create(CGFobject.prototype);
DebateTable.prototype.constructor = DebateTable;


DebateTable.prototype.display = function() {
    
    this.scene.pushMatrix();
        this.scene.translate(-3, 0, 2);
        this.scene.rotate(-Math.PI/4, 0, 1, 0);
        this.scene.scale(1, 2, 4);
        this.component1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.scale(2, 2, 2);
        this.scene.translate(0, 0, 0.5);
        this.component2.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(3, 0, 2);
        this.scene.rotate(Math.PI/4, 0, 1, 0);
        this.scene.scale(1, 2, 4);
        this.component1.display();
    this.scene.popMatrix();
};