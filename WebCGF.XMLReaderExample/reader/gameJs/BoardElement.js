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
	this.selectable=false;
	this.material = new CGFappearance(scene);
	this.material.setTexture(texture);
	this.visible=true;
};

BoardElement.prototype = Object.create(CGFobject.prototype);
BoardElement.prototype.constructor = BoardElement;


BoardElement.prototype.display = function() {
	if(this.visible){
		this.scene.pushMatrix();


		if(this.selectable)
	  	this.scene.registerForPick(this.id, this);


		if(this.selected)
			this.scene.translate(0,0,1);

		if(this.piece != null)
				this.piece.display();

		this.material.apply();
		this.body.display();

		if(this.selectable)//so that further objects dont have the same pick id
			this.scene.clearPickRegistration();


	  this.scene.popMatrix();
	}
}

BoardElement.prototype.setPiece = function(Npiece) {
	this.piece = Npiece;
}

BoardElement.prototype.select = function() {
	this.selected = !this.selected;
}

BoardElement.prototype.enableselection = function() {
	this.selectable = true;
}

BoardElement.prototype.disableselection = function() {
	this.selectable = false;
}

BoardElement.prototype.setVisible = function(value) {
	this.visible = value;
}
