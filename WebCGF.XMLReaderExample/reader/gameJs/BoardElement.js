/**
* BoardElement
* @constructor
*/

function BoardElement(scene,id, textureNormal,textureSelected,textureSelectable,x,y) {
	CGFobject.call(this,scene);
	this.id=id;
	this.body = new Cube(scene);
	this.piece = null;
	this.selected=false;
	this.selectable=false;
	this.isWall=false;
	this.x=x;
	this.y=y;

	this.material = new CGFappearance(scene);
	this.material.setTexture(textureNormal);

	this.materialSelected = new CGFappearance(scene);
	this.materialSelected.setTexture(textureSelected);

	this.materialSelectable = new CGFappearance(scene);
	this.materialSelectable.setTexture(textureSelectable);
}

BoardElement.prototype = Object.create(CGFobject.prototype);
BoardElement.prototype.constructor = BoardElement;


BoardElement.prototype.display = function() {
		this.scene.pushMatrix();

		if(this.selectable)
			this.scene.registerForPick(this.id, this);

		if(this.piece !== null)
				this.piece.display();

		if(this.selected)
			this.materialSelected.apply();
		else if(this.selectable)
			this.materialSelectable.apply();
		else
			this.material.apply();




		if(this.isWall){

			if(this.x % 2 == 1)
				if(this.y % 2 == 1)
					this.scene.scale(0.19,0.19,1);
				else
					this.scene.scale(0.19,1,1);
			else
				this.scene.scale(1,0.19,1);
		}

		this.body.display();

		if(this.selectable)//so that further objects dont have the same pick id
			this.scene.clearPickRegistration();


	  this.scene.popMatrix();

};

BoardElement.prototype.setPiece = function(Npiece) {
	this.piece = Npiece;
};

BoardElement.prototype.select = function() {
	this.selected = !this.selected;
};

BoardElement.prototype.handleSelection = function(enable) {
	this.selectable = enable;
};

BoardElement.prototype.setWall = function(enable) {
	this.isWall = enable;
};

BoardElement.prototype.resetElement = function(enable) {
	this.selectable = false;
	this.selected = false;
};
