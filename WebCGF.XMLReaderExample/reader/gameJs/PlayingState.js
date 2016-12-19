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


  this.handleState();
}


PlayingState.prototype.constructor=PlayingState;

PlayingState.prototype.handleState = function (){
  switch (this.currentState) {
    case states.SELECT_PIECE:
          this.enablePieceSelect();
      break;
    case states.SELECT_TILE:
          this.enableTilesSelect();
      break;
    case states.ANIMATE_PLAY:
      break;
    case states.CHECK_END:
      break;
    case states.CHANGE_PLAYER://dar disable das tiles
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

PlayingState.prototype.picking = function (){

  if (this.scene.pickMode == false) {
    if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
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
                  if(obj.piece != null){//selecionou outro peao
                  this.pawnSelected.select();
                  this.pawnSelected=obj;
                }else{//selecionou uma tile
                  this.tileSelected = obj;
                  this.makeMove();
                  //this.updatePawnPosition(this.pawnSelected.piece);

                }

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
      }
      this.scene.pickResults.splice(0,this.scene.pickResults.length);
    }
  }
}

PlayingState.prototype.enableTilesSelect = function (){

  var x = this.pawnSelected.piece.x;
  var y = this.pawnSelected.piece.y;

  for (var i = y-2 ; i <=  y+2; i+=2) {
    for (var j = x-2; j <=  x+2; j+=2) {
      enableCellSelect(j, i, this.board.elements);
    }
  }
    enableCellSelect(x-4, y, this.board.elements);
    enableCellSelect(x+4, y, this.board.elements);
    enableCellSelect(x, y-4, this.board.elements);
    enableCellSelect(x, y+4, this.board.elements);
}

function enableCellSelect(x,y,elements){
  if(x >= 0 && x <= 20 && y >= 0 && y <= 26)
    elements[x][y].enableselection();
}

PlayingState.prototype.makeMove = function (){

  var state=this;
  var offsetX= (this.tileSelected.x - this.pawnSelected.piece.x)/2;
  var offsetY= (this.tileSelected.y - this.pawnSelected.piece.y)/2;

  this.client.getPrologRequest("move(" + this.pawnSelected.piece.identifier + ","
                                       + offsetX + "," + offsetY + ")", function(data) {
    console.log(data.target.responseText);
  });
}

PlayingState.prototype.updatePawnPosition = function(pawn){
  var state=this;

  this.client.getPrologRequest(pawn.identifier, function(data) {
    var parsed =JSON.parse(data.target.responseText);
    game.clearPawnPos(pawn);
    pawn.x=parsed[0];
    pawn.y=parsed[1];
    game.setPawnPos(pawn);
    game.waiting++;
  });
}
