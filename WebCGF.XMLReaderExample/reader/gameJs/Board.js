/**
* Board
* @constructor
*/
function Board(scene) {
	CGFobject.call(this,scene);
	var elementNormalTex=new CGFtexture(scene, "resources\\images\\rocket_body.jpg");
	var elementSelectedTex=new CGFtexture(scene, "resources\\images\\rocket_top.jpg");
	var elementSelectableTex=new CGFtexture(scene, "resources\\images\\neptune.jpg");

  this.elements=new Array(27);
  for (var i = 0; i < 27; i++) {
    this.elements[i]=new Array(21);
  }
	var id=0;
  for (var i = 0; i < 27; i++) {
    for (var j = 0; j < 21; j++) {
      this.elements[j][i] = new  BoardElement(scene,id++,elementNormalTex,elementSelectedTex,elementSelectableTex,j,i);
				if(j % 2 == 1 || i % 2 == 1)
					this.elements[j][i].setVisible(false);
    }
  }

};

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
}
