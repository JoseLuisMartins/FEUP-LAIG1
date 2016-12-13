/**
* BoardElement
* @constructor
*/

function BoardElement(scene,id, texture) {
	CGFobject.call(this,scene);
	this.id=id;
	this.body = new Cube(scene);
	this.piece = null;
	this.selected=false;
};

BoardElement.prototype = Object.create(CGFobject.prototype);
BoardElement.prototype.constructor = BoardElement;


BoardElement.prototype.display = function() {

	this.scene.pushMatrix();
  this.scene.registerForPick(this.id, this);

	if(this.selected)
		this.scene.translate(0,0,1);

	if(this.piece != null)
			this.piece.display();


	this.body.display();

  this.scene.popMatrix();
}

BoardElement.prototype.setPiece = function(Npiece) {
	this.piece = Npiece;
}

BoardElement.prototype.select = function() {
	this.selected = !this.selected;
}
