/**
* WallBoard
* @constructor
*/
function WallBoard(scene,texture) {
	CGFobject.call(this,scene);
  this.scene=scene;

  this.material = new CGFappearance(scene);
  this.material.setTexture(texture);

  var greenTex=new CGFtexture(scene, "resources\\images\\green.png");
  var blueTex=new CGFtexture(scene, "resources\\images\\blue.jpg");

  this.base = new Cube(scene);
  //green Walls - Vertically
  this.greenWall = new Wall(scene,greenTex,"v");
  //blue Walls - horizontally
  this.blueWall = new Wall(scene,blueTex,"h");

};

WallBoard.prototype = Object.create(CGFobject.prototype);
WallBoard.prototype.constructor = WallBoard;


WallBoard.prototype.display = function() {

//body
  this.scene.pushMatrix();

  this.scene.translate(5,0,0);
  this.scene.scale(2,0.2,4);
  this.material.apply();
  this.base.display();

	this.scene.popMatrix();

//walls
  this.scene.pushMatrix();

  this.scene.translate(5,0,0);
  this.scene.scale(1,0.5,1);

  this.scene.pushMatrix();
  this.scene.translate(0,0.4,1);
  this.greenWall.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(0,0.4,-1);
  this.blueWall.display();
  this.scene.popMatrix();

  this.scene.popMatrix();



}
