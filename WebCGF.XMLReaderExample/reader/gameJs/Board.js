/**
* Board
* @constructor
*/
function Board(scene) {
	CGFobject.call(this,scene);

  this.elements=new Array(26);
  for (var i = 0; i < 26; i++) {
    this.elements[i]=new Array(20);
  }

  for (var i = 0; i < 26; i++) {
    for (var j = 0; j < 20; j++) {
      var id = (i+1) + "" + (j+1);
      this.elements[j][i] = new  BoardElement(scene,id,null);
    }
  }

};

Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;


Board.prototype.display = function() {

  this.scene.pushMatrix();

	this.scene.scale(0.4,0.4,0.4);

  for (var i = 0; i < 26; i++) {
    for (var j = 0; j < 20; j++) {
      this.scene.pushMatrix();
      this.scene.translate(j,i,0);
      this.elements[j][i].display();
      this.scene.popMatrix();
    }
  }

	this.scene.popMatrix();
}
