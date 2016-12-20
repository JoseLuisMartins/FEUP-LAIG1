
function Blockade(scene,mode){
  this.scene=scene;


  this.client = new Client();
  this.board = new Board(scene);

  var WallBoardTex=new CGFtexture(scene, "resources\\images\\boardTex2.jpg");
  this.WallBoardOrange = new WallBoard(scene,WallBoardTex);
  this.WallBoardYellow = new WallBoard(scene,WallBoardTex);

  this.prologBoard=null;

  this.init();
}

Blockade.prototype.constructor=Blockade;

Blockade.prototype.init = function (){

  this.orange1 = new Pawn(this.scene,"resources\\images\\abstractorange.jpg","[orange,1]","o");
  this.orange2 = new Pawn(this.scene,"resources\\images\\abstractorange.jpg","[orange,2]","o");
  this.yellow1 = new Pawn(this.scene,"resources\\images\\boardTex.png","[yellow,1]","y");
  this.yellow2 = new Pawn(this.scene,"resources\\images\\boardTex.png","[yellow,2]","y");
  this.state=null;
  this.waiting=0;

  this.updateAllPawnPositions();


}

Blockade.prototype.logPicking = function ()
{
	 if(this.state != null)
    this.state.picking();
}

Blockade.prototype.display = function (){

  this.scene.pushMatrix();

  this.board.display();

  this.scene.pushMatrix();
  this.scene.translate(0,0,2.5);
  this.WallBoardOrange.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(10,0,-3);
  this.scene.rotate(Math.PI,0,1,0);
  this.WallBoardYellow.display();
  this.scene.popMatrix();

  this.scene.popMatrix();
}


Blockade.prototype.waitUpdatePositions = function(){

}

Blockade.prototype.updatePawnPosition = function(pawn){
  var game=this;

  this.client.getPrologRequest( pawn.identifier , function(data) {
    var parsed =JSON.parse(data.target.responseText);
    game.clearPawnPos(pawn);
    pawn.x=parsed[0];
    pawn.y=parsed[1];
    game.setPawnPos(pawn);
    game.waiting++;
    game.goToPlaystate();
  });
}

Blockade.prototype.getPrologBoard = function(){
  var game=this;

  this.client.getPrologRequest("board", function(data) {
    game.prologBoard=data.target.responseText;
    game.waiting++;
    game.goToPlaystate();
  });
}

Blockade.prototype.updateAllPawnPositions = function ()
{
  this.updatePawnPosition(this.orange1);
  this.updatePawnPosition(this.orange2);
  this.updatePawnPosition(this.yellow1);
  this.updatePawnPosition(this.yellow2);

}

Blockade.prototype.goToPlaystate = function (){
  if(this.waiting == 4)
    this.state=new PlayingState(this.scene,this.client,this.board,this.WallBoardOrange,this.WallBoardYellow,this.orange1,this.orange2,this.yellow1,this.yellow2);

}


Blockade.prototype.setPawnPos = function (pawn){
  this.board.elements[pawn.x][pawn.y].setPiece(pawn);
}

Blockade.prototype.clearPawnPos = function (pawn){
  this.board.elements[pawn.x][pawn.y].setPiece(null);
}
