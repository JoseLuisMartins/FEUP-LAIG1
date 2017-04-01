/**
 * Universe
 * @constructor
 */
 function Universe(scene) {
 	CGFobject.call(this,scene);

  	this.quad = new Rectangle(scene, new Point3(-0.5,-0.5,0), new Point3(0.5,0.5,0));
 }

 Universe.prototype = Object.create(CGFobject.prototype);
 Universe.prototype.constructor = Universe;

 Universe.prototype.display = function() {

     this.scene.pushMatrix();
        this.scene.translate(0, 0, 0.5);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.quad.display();
     this.scene.popMatrix();

     this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.quad.display();
     this.scene.popMatrix();

     this.scene.pushMatrix();
        this.scene.translate(-0.5, 0, 0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.quad.display();
     this.scene.popMatrix();

     this.scene.pushMatrix();
        this.scene.translate(0.5, 0, 0);
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.quad.display();
     this.scene.popMatrix();

     this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.quad.display();
     this.scene.popMatrix();

     this.scene.pushMatrix();
        this.scene.translate(0, -0.5, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.quad.display();
     this.scene.popMatrix();
 };