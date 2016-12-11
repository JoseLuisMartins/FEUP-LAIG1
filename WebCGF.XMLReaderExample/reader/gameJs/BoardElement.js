/**
* BoardElement
* @constructor
*/
function BoardElement(scene,id, texture) {
	CGFobject.call(this,scene);
	this.id=id;
	this.body = new Cube(scene);

};

BoardElement.prototype = Object.create(CGFobject.prototype);
BoardElement.prototype.constructor = BoardElement;


BoardElement.prototype.display = function() {

	this.scene.pushMatrix();
  this.scene.registerForPick(this.id, this);
	this.body.display();

  this.scene.popMatrix();
}
