/**
* Box
* @constructor
*/
function Box(scene, texture1, texture2) {
  CGFobject.call(this,scene);
  this.scene=scene;

  this.material = new CGFappearance(scene);
  this.material.setTexture(texture1);

	this.material2 = new CGFappearance(scene);
	this.material2.setTexture(texture2);

  this.cube = new Cube(scene);
}

Box.prototype = Object.create(CGFobject.prototype);
Box.prototype.constructor = Box;


Box.prototype.display = function() {


  //box

  	this.material.apply();

  	this.scene.pushMatrix();
    this.scene.scale(2,0.1,4);
    this.cube.display();
  	this.scene.popMatrix();

  	this.material2.apply();

  	this.scene.pushMatrix();
  	this.scene.translate(0,0.25,2);
    this.scene.scale(2,0.6,0.1);
    this.cube.display();
  	this.scene.popMatrix();

  	this.scene.pushMatrix();
  	this.scene.translate(0,0.25,-2);
  	this.scene.scale(2,0.6,0.1);
    this.cube.display();
  	this.scene.popMatrix();

  	this.scene.pushMatrix();
  	this.scene.translate(-1,0.25,0);
  	this.scene.scale(0.1,0.6,4);
    this.cube.display();
  	this.scene.popMatrix();

  	this.scene.pushMatrix();
  	this.scene.translate(1,0.25,0);
  	this.scene.scale(0.1,0.6,4);
  	this.cube.display();
  	this.scene.popMatrix();



  // boxEnd
};
