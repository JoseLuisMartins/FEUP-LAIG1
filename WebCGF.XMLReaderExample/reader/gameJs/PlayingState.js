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


function PlayingState(scene,client,board,orange1,orange2,yellow1,yellow2){

  this.scene=scene;
  //game
  this.board=board;
  this.currentState= states.SELECT_PIECE;
  this.currentPlayer= players.ORANGE;
  this.pawnSelected= null;
  this.tileSelected= null;

  //pawns
  this.orange1=orange1;
  this.orange2=orange2;
  this.yellow1=yellow1;
  this.yellow=yellow2;
  //conection
  this.waitingForRequest=false;
  this.client=client;

  //game story
  this.currentPlayId=0;
  this.plays={};


  this.handleState();
}


PlayingState.prototype.constructor=PlayingState;

PlayingState.prototype.handleState = function (){
  switch (this.currentState) {
    case states.SELECT_PIECE:
          this.handlePieceSelect(true);
      break;
    case states.SELECT_TILE:
          this.handleTilesPicking(true);
      break;
    case states.ANIMATE_PLAY:
          this.handleTilesPicking(false);
          this.handlePieceSelect(false);

          //fazer animaçao neste momento animacao é feita no move depois ai é só a validacao

      break;
    case states.CHECK_END:
      break;
    case states.CHANGE_PLAYER://animaçao da camera
      break;
    default:

  }
}

PlayingState.prototype.handlePieceSelect = function (enable){

  if(this.currentPlayer == players.ORANGE) {
    this.board.elements[this.orange1.x][this.orange1.y].handleSelection(enable);
    this.board.elements[this.orange2.x][this.orange2.y].handleSelection(enable);
  }else {
    this.board.elements[this.yellow1.x][this.yellow1.y].handleSelection(enable);
    this.board.elements[this.yellow2.x][this.yellow2.y].handleSelection(enable);
  }

}

PlayingState.prototype.deselectPlayElements = function (enable){
  var play = this.plays[this.currentPlayId];
  this.board.elements[play.pawnStart.x][play.pawnStart.y].select();
  this.board.elements[play.pawnEnd.x][play.pawnEnd.y].select();
}

PlayingState.prototype.picking = function (){

  if (this.scene.pickMode === false) {
    if (this.scene.pickResults !== null && this.scene.pickResults.length > 0) {
      for (var i=0; i< this.scene.pickResults.length; i++) {
        var obj = this.scene.pickResults[i][0];
        if (obj instanceof BoardElement)
        {
          var Id = this.scene.pickResults[i][1];
          obj.select();
          switch (this.currentState) {
            case states.SELECT_PIECE:
                  this.pawnSelected=obj;
                  this.currentState=states.SELECT_TILE;
                  this.handleState();
              break;
            case states.SELECT_TILE:
                if(obj.piece !== null){//selecionou outro peao
                  this.pawnSelected.select();
                  this.handleTilesPicking(false);//disable das tiles do peao antigo
                  this.pawnSelected=obj;
                  this.handleState();
                }else{//selecionou uma tile
                  this.tileSelected = obj;
                  this.makeMove();
                  this.currentState=states.ANIMATE_PLAY;
                  this.handleState();
                }

              break;
            case states.ANIMATE_PLAY:
              break;
            //SELECIONAR PAREDE!!!!!!!!!!
            case states.CHECK_END:
              break;
            case states.CHANGE_PLAYER:
              break;
            default:

          }
        }
      }
      this.scene.pickResults.splice(0,this.scene.pickResults.length);
    }
  }
}

PlayingState.prototype.handleTilesPicking = function (enable){

  var x = this.pawnSelected.piece.x;
  var y = this.pawnSelected.piece.y;

  for (var i = y-2 ; i <=  y+2; i+=2) {
    for (var j = x-2; j <=  x+2; j+=2) {
      if(!(i == y && j == x))
        handleTilePicking(j, i, this.board.elements,enable);
    }
  }
    handleTilePicking(x-4, y, this.board.elements,enable);
    handleTilePicking(x+4, y, this.board.elements,enable);
    handleTilePicking(x, y-4, this.board.elements,enable);
    handleTilePicking(x, y+4, this.board.elements,enable);
}

function handleTilePicking(x,y,elements,enable){
  if(x >= 0 && x <= 20 && y >= 0 && y <= 26)
    elements[x][y].handleSelection(enable);
}

PlayingState.prototype.makeMove = function (){

  var state=this;
  var offsetX= (this.tileSelected.x - this.pawnSelected.piece.x)/2;
  var offsetY= (this.tileSelected.y - this.pawnSelected.piece.y)/2;

  this.client.getPrologRequest("move(" + state.pawnSelected.piece.identifier + ","
                                       + offsetX + "," + offsetY + ")", function(data) {

    console.log(data.target.responseText);

    var pawn = state.pawnSelected.piece;
    var oldPos = new Point2(pawn.x,pawn.y);
    state.clearPawnPos(state.pawnSelected.piece);

    var newPos = JSON.parse(data.target.responseText);
    pawn.x=newPos[0];
    pawn.y=newPos[1];

    state.plays[state.currentPlayId]= new Play(state.currentPlayId,
                                             oldPos,
                                             new Point2(pawn.x,pawn.y));

    state.setPawnPos(pawn);
    state.deselectPlayElements();
  });
}



PlayingState.prototype.setPawnPos = function (pawn){
  this.board.elements[pawn.x][pawn.y].setPiece(pawn);
}

PlayingState.prototype.clearPawnPos = function (pawn){
  this.board.elements[pawn.x][pawn.y].setPiece(null);
}
