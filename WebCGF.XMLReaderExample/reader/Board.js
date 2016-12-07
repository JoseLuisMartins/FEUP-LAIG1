/**
* Board
* @constructor
*/
function Board(scene) {
	CGFobject.call(this,scene);

  this.elements=new Array(14);
  for (var i = 0; i < 14; i++) {
    this.elements[i]=new Array(11);
  }

  for (var i = 0; i < 14; i++) {
    for (var j = 0; j < 11; j++) {
      var id = (i+1) + "" + (j+1);
      this.elements[j][i] = new  BoardElement(scene,id,null);
    }
  }

};

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;


Board.prototype.display = function() {

  this.scene.pushMatrix();


  for (var i = 0; i < 14; i++) {
    for (var j = 0; j < 11; j++) {
      this.scene.pushMatrix();
      this.scene.translate(j,i,0);
      this.elements[j][i].display();
      this.scene.popMatrix();
    }
  }

	this.scene.popMatrix();
}
