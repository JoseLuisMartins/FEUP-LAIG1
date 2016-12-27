/**
* WallBoard
* @constructor
*/
function WallBoard(scene,texture) {
	CGFobject.call(this,scene);
  this.scene=scene;

	this.box = new Box(scene, texture, new CGFtexture(scene, "resources\\images\\wood.jpg"));

  var greenTex=new CGFtexture(scene, "resources\\images\\green.png");
  var blueTex=new CGFtexture(scene, "resources\\images\\blue.png");
	var buttonTex=new CGFtexture(scene, "resources\\images\\skipButton.png");

  var elementNormalTex=new CGFtexture(scene, "resources\\images\\rocket_body.jpg");
  var elementSelectedTex=new CGFtexture(scene, "resources\\images\\rocket_top.jpg");
  var elementSelectableTex=new CGFtexture(scene, "resources\\images\\neptune.jpg");

  

	//button
	this.button = new  BoardElement(scene,10000,elementNormalTex,elementSelectedTex,buttonTex,0,0);
  //green Walls - Vertically
  this.greenWall =  new  BoardElement(scene,10001,elementNormalTex,elementSelectedTex,elementSelectableTex,1,0);
	this.greenWall.setWall(true);
  this.greenWall.setPiece(new Wall(scene,greenTex,"v"));
  //blue Walls - horizontally
  this.blueWall = new  BoardElement(scene,10002,elementNormalTex,elementSelectedTex,elementSelectableTex,0,0);
	this.blueWall.setWall(true);
  this.blueWall.setPiece(new Wall(scene,blueTex,"h"));

}

WallBoard.prototype = Object.create(CGFobject.prototype);
WallBoard.prototype.constructor = WallBoard;


WallBoard.prototype.display = function() {

	this.box.display();
//walls
  this.scene.pushMatrix();

  this.scene.scale(1,0.5,1);
//green
  this.scene.pushMatrix();
  this.scene.translate(0,0.4,1);
	this.scene.rotate(-Math.PI/2,1,0,0);
  this.greenWall.display();
  this.scene.popMatrix();
//blue
  this.scene.pushMatrix();
  this.scene.translate(0,0.4,-1);
	this.scene.rotate(-Math.PI/2,1,0,0);
  this.blueWall.display();
  this.scene.popMatrix();

//button
	this.scene.pushMatrix();
	this.scene.translate(0,0,3.5);
	this.scene.scale(2,0.2,1.5);
	this.button.display();
	this.scene.popMatrix();

  this.scene.popMatrix();

};


WallBoard.prototype.handleSelectionButton = function(enable) {
  this.button.handleSelection(enable);
};


WallBoard.prototype.handleSelectionBlueWall = function(enable) {
  this.blueWall.handleSelection(enable);
};


WallBoard.prototype.handleSelectionGreenWall = function(enable) {
	this.greenWall.handleSelection(enable);
};



WallBoard.prototype.handleSelection= function(enable) {
	this.greenWall.handleSelection(enable);
  this.blueWall.handleSelection(enable);
	this.button.handleSelection(enable);
};
