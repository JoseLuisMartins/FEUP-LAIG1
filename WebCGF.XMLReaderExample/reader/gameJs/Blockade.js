var mode={
  HUMAN_VS_HUMAN: 1,
  HUMAN_VS_BOT: 2,
};

var difficulty={
  HARD: 1,
  EASY: 2,
};


function Blockade(scene) {
  this.scene=scene;


  this.client = new Client();
  this.board = new Board(scene);
  this.state = null;

  var WallBoardTex=new CGFtexture(scene, "resources\\images\\boardTex2.jpg");
  this.WallBoardOrange = new WallBoard(scene,WallBoardTex);
  this.WallBoardYellow = new WallBoard(scene,WallBoardTex);

  this.prologBoard=null;

  this.gameMode=mode.HUMAN_VS_BOT;
  this.gameDifficulty=difficulty.HARD;

  this.changingState=false;

  this.init();
}

Blockade.prototype.constructor=Blockade;

Blockade.prototype.init = function (){

  this.orange1 = new Pawn(this.scene,"resources\\images\\abstractorange.jpg","[orange,1]","orange");
  this.orange2 = new Pawn(this.scene,"resources\\images\\abstractorange.jpg","[orange,2]","orange");
  this.yellow1 = new Pawn(this.scene,"resources\\images\\boardTex.png","[yellow,1]","yellow");
  this.yellow2 = new Pawn(this.scene,"resources\\images\\boardTex.png","[yellow,2]","yellow");

  this.waiting = 0;

  this.initPrologGraph();
};

Blockade.prototype.logPicking = function ()
{
	 if (this.state !== null) {
      this.state.picking();

      if (this.state instanceof MenuState && this.state.ready && this.changingState === false) {//passar para o jogo
        this.changingState = true;
        this.gameMode=this.state.mode;
        this.gameDifficulty=this.state.difficulty;
        this.initPrologGraph();
      }
   }
};

Blockade.prototype.display = function () {
  if (this.state !== null)
    this.state.display();
};

Blockade.prototype.update = function (currtime){

  if(this.state !== null)
    this.state.update(currtime);
};


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
};

Blockade.prototype.getPrologBoard = function(){
  var game=this;

  this.client.getPrologRequest("board", function(data) {
    game.prologBoard=data.target.responseText;
    game.waiting++;
    game.goToPlaystate();
  });
};

Blockade.prototype.initPrologGraph = function(){
  var game=this;

  this.client.getPrologRequest("init", function(data) {
    game.updateAllPawnPositions();
    game.waiting++;
    game.goToPlaystate();
  });
};

Blockade.prototype.updateAllPawnPositions = function ()
{
  this.updatePawnPosition(this.orange1);
  this.updatePawnPosition(this.orange2);
  this.updatePawnPosition(this.yellow1);
  this.updatePawnPosition(this.yellow2);

};

Blockade.prototype.goToPlaystate = function (){
  if(this.waiting == 5) {
    this.state=new PlayingState(this.scene,this.client,this.board,this.WallBoardOrange,this.WallBoardYellow,
      this.orange1,this.orange2,this.yellow1,this.yellow2,this.gameMode,this.gameDifficulty);
  }

};

Blockade.prototype.undo = function (){

    if(this.state instanceof PlayingState)
      this.state.undo();
};

Blockade.prototype.setPawnPos = function (pawn){
  this.board.elements[pawn.x][pawn.y].setPiece(pawn);
};

Blockade.prototype.clearPawnPos = function (pawn){
  this.board.elements[pawn.x][pawn.y].setPiece(null);
};
