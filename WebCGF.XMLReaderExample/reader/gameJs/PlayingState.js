var states={
  SELECT_PIECE: 1,
  SELECT_TILE: 2,
  ANIMATE_PLAY: 3,
  CHECK_END: 4,
  CHANGE_PLAYER:5,
}

var players={
  ORANGE: 1,
  YELLOW: 2,
}


function PlayingState(scene,board,orange1,orange2,yellow1,yellow2){
  this.scene=scene;
  this.board=board;
  this.currentState= states.SELECT_PIECE;
  this.currentPlayer= players.ORANGE;
  this.orange1=orange1;
  this.orange2=orange2;
  this.yellow1=yellow1;
  this.yellow=yellow2;
  this.waitingForRequest=false;

  this.handleState();
}


PlayingState.prototype.constructor=PlayingState;

PlayingState.prototype.handleState = function (){
  switch (this.currentState) {
    case states.SELECT_PIECE:
          this.enablePieceSelect();
      break;
    case states.SELECT_TILE:
      break;
    case states.ANIMATE_PLAY:
      break;
    case states.CHECK_END:
      break;
    case states.CHANGE_PLAYER:
      break;
    default:

  }
}

PlayingState.prototype.enablePieceSelect = function (){
  console.log("X: " + this.orange1.x);

  if(this.currentPlayer == players.ORANGE) {
    this.board.elements[this.orange1.x][this.orange1.y].enableselection();
    this.board.elements[this.orange2.x][this.orange2.y].enableselection();
  }else {
    this.board.elements[this.yellow1.x][this.yellow1.y].enableselection();
    this.board.elements[this.yellow2.x][this.yellow2.y].enableselection();
  }

}





PlayingState.prototype.init = function (){

}
