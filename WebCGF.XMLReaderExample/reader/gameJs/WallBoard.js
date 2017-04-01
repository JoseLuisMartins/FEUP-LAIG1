/**
* WallBoard
* @constructor
*/
function WallBoard(scene) {
	CGFobject.call(this,scene);
  this.scene=scene;

	this.box = new Box(scene);

  var greenTex=new CGFtexture(scene, "resources\\images\\green.png");
  var blueTex=new CGFtexture(scene, "resources\\images\\blue.png");

	var buttonTex=new CGFtexture(scene, "resources\\images\\skipButton.png");
	var buttonNormal=new CGFtexture(scene, "resources\\images\\skipButtonDefault.png");

  var elementNormalTex=new CGFtexture(scene, "resources\\images\\rocket_body.jpg");
  var elementSelectedTex=new CGFtexture(scene, "resources\\images\\rocket_top.jpg");
  var elementSelectableTex=new CGFtexture(scene, "resources\\images\\neptune.jpg");

	//wall counters
	this.blueWallsNumber = new Displayer(scene, 9);
  this.greenWallsNumber = new Displayer(scene, 9);

	this.blueWallsNumber.setDisplayOneDigit(true);
	this.greenWallsNumber.setDisplayOneDigit(true);


	//button
	this.button = new  BoardElement(scene,10000,buttonNormal,elementSelectedTex,buttonTex,0,0);
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
//box
	this.scene.pushMatrix();
	this.scene.translate(0.5,0,0);
	this.scene.scale(1.5,1,1);
	this.box.display();
	this.scene.popMatrix();

//counters
	//blue
	this.scene.pushMatrix();
	this.scene.translate(0.6,0.1,-0.6);
	this.scene.rotate(-Math.PI/2,1,0,0);
	this.blueWallsNumber.display();
	this.scene.popMatrix();

	//green
	this.scene.pushMatrix();
	this.scene.translate(0.6,0.1,1.4);
	this.scene.rotate(-Math.PI/2,1,0,0);
	this.greenWallsNumber.display();
	this.scene.popMatrix();


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
	this.scene.translate(0.5,0,3.5);
	this.scene.scale(2,0.05,1.5);
	this.scene.rotate(-Math.PI/2,0,1,0);
	this.button.display();
	this.scene.popMatrix();

  this.scene.popMatrix();

};

WallBoard.prototype.setBlueNumber = function(val) {
  this.blueWallsNumber.setNumber(val);
};

WallBoard.prototype.setGreenNumber = function(val) {
  this.greenWallsNumber.setNumber(val);
};

WallBoard.prototype.handleSelectionButton = function(enable) {
  this.button.handleSelection(enable);
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

WallBoard.prototype.clearAllTiles = function() {
	this.greenWall.resetSelect();
  this.blueWall.resetSelect();
	this.button.resetSelect();
};
