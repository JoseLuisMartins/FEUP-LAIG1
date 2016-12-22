/**
* Board
* @constructor
*/
function Board(scene) {
	CGFobject.call(this,scene);
	var elementNormalTex=new CGFtexture(scene, "resources\\images\\rocket_body.jpg");
	var elementSelectedTex=new CGFtexture(scene, "resources\\images\\rocket_top.jpg");
	var elementSelectableTex=new CGFtexture(scene, "resources\\images\\neptune.jpg");
	var elementBaseTex=new CGFtexture(scene, "resources\\images\\robotSkin.jpg");
	var elementWallBaseTex=new CGFtexture(scene, "resources\\images\\wall.jpg");

	this.wallTiles=[];

  this.elements=new Array(27);
  for (var i = 0; i < 27; i++) {
    this.elements[i]=new Array(21);
  }
	var id=0;
  for (var i = 0; i < 27; i++) {
    for (var j = 0; j < 21; j++) {
			if((i==20 && j == 14) || (i==20 && j == 6) || (i==6 && j == 14) || (i==6 && j == 6))//bases
      	this.elements[j][i] = new  BoardElement(scene,id++,elementBaseTex,elementSelectedTex,elementSelectableTex,j,i);
			else if(j % 2 == 1 || i % 2 == 1){//walls
				this.elements[j][i] = new  BoardElement(scene,id++,elementWallBaseTex,elementSelectedTex,elementSelectableTex,j,i);
				this.wallTiles.push(this.elements[j][i]);
			}
			else
				this.elements[j][i] = new  BoardElement(scene,id++,elementNormalTex,elementSelectedTex,elementSelectableTex,j,i);

    }
  }

}

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;


Board.prototype.display = function() {

  this.scene.pushMatrix();

	this.scene.translate(-5,0,5);
	this.scene.rotate(-Math.PI/2,1,0,0);
	this.scene.scale(0.4,0.4,0.4);

  for (var i = 0; i < 27; i++) {
    for (var j = 0; j < 21; j++) {
      this.scene.pushMatrix();
        this.scene.translate(j,i,0);
        this.elements[j][i].display();
      this.scene.popMatrix();
    }
  }

	this.scene.popMatrix();
};

Board.prototype.getWallTiles = function() {
	return this.wallTiles;
};
