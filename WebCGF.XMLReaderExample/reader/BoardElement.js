/**
* BoardElement
* @constructor
*/
function BoardElement(scene,id, texture) {
	CGFobject.call(this,scene);
	this.id=id;
	this.body = new Prism(scene,4,5);
};

BoardElement.prototype = Object.create(CGFobject.prototype);
BoardElement.prototype.constructor = BoardElement;


BoardElement.prototype.display = function() {

	this.scene.pushMatrix();
  this.scene.rotate(Math.PI/4,0,0,1);
  this.scene.registerForPick(this.id, this);
  this.body.display();

  this.scene.popMatrix();
}
