var states={
  SELECT_PIECE: 1,
  SELECT_TILE: 2,
  ANIMATE_PLAY: 3,
  SELECT_WALL: 4,
  SELECT_WALL_TILE: 5,
  ANIMATE_WALL: 6,
  CHECK_END: 7,
  CHANGE_PLAYER: 8,
}

var players={
  ORANGE: 1,
  YELLOW: 2,
}


function PlayingState(scene,client,board,wallBoardOrange,wallBoardYellow,orange1,orange2,yellow1,yellow2){

  this.scene=scene;
  //game
  //boards
  this.board=board;
  this.wallBoardOrange=wallBoardOrange;
  this.wallBoardYellow=wallBoardYellow;

  //game cycle
  this.currentState= states.SELECT_PIECE;
  this.currentPlayer= players.ORANGE;
  this.pawnSelected= null;
  this.tileSelected= null;
  this.wallSelected= null;
  this.wallTileSelected= null;

  //pawns
  this.orange1=orange1;
  this.orange2=orange2;
  this.yellow1=yellow1;
  this.yellow2=yellow2;
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
          this.handlePiecePicking(true);
      break;
    case states.SELECT_TILE:
          this.handleTilesPicking(true);
      break;
    case states.ANIMATE_PLAY:
          //tornar tiles da ultima jogada nao selecionaveis
          var lastPlayerPos = this.plays[this.currentPlayId].pawnStart;
          this.handleTilesPicking(false);
          //tornar as pecas do jogador atual nao selecionaveis,para preparar a proxima jogada
          this.handlePiecePicking(false);
          //e desselecionar peça e tile selecionada no decorrer da jogada
          this.deselectPlayElements();
          //fazer animaçao - mover
          this.animatePlay();
          //proximo estado
          this.currentState=states.SELECT_WALL;
          this.handleState();
      break;
    case states.SELECT_WALL:
          this.handleWallPicking(true);
      break;
    case states.SELECT_WALL_TILE:
          this.handleWallTilesPicking(true);
      break;
    case states.ANIMATE_WALL:

      break;
    case states.CHECK_END:
          //verificar vencedor
          this.checkEnd();
          //proximo estado
          this.currentState=states.CHANGE_PLAYER;
          this.handleState();
      break;
    case states.CHANGE_PLAYER://animaçao da camera
          //proximo jogador
          if(this.currentPlayer==players.ORANGE)
            this.currentPlayer=players.YELLOW;
          else
            this.currentPlayer=players.ORANGE;

          //proximo estado
          this.currentState=states.SELECT_PIECE;
          this.handleState();
      break;
    default:

  }
}

PlayingState.prototype.handleWallPicking = function (enable){
  if(this.currentPlayer=players.ORANGE)
    this.wallBoardOrange.handleSelection(enable);
  else
    this.wallBoardYellow.handleSelection(enable);

}

PlayingState.prototype.handleWallTilesPicking = function (enable){
  
}


PlayingState.prototype.animatePlay = function (){
  var pawn = this.pawnSelected.piece;
  //dados da jogada
  var play = this.plays[this.currentPlayId];
  //limpar posicao atual do peao
  this.clearPawnPos(pawn);
  //atualizar posicao do peao
  pawn.x = play.pawnEnd.x;
  pawn.y = play.pawnEnd.y;

  //este set depois deve ser uma animacao
  this.setPawnPos(pawn);

}


PlayingState.prototype.handlePiecePicking = function (enable){

  if(this.currentPlayer == players.ORANGE) {
    this.board.elements[this.orange1.x][this.orange1.y].handleSelection(enable);
    this.board.elements[this.orange2.x][this.orange2.y].handleSelection(enable);
  }else {
    this.board.elements[this.yellow1.x][this.yellow1.y].handleSelection(enable);
    this.board.elements[this.yellow2.x][this.yellow2.y].handleSelection(enable);
  }

}

PlayingState.prototype.deselectPlayElements = function (enable){
  var pawn = this.pawnSelected;
  var tile = this.tileSelected;
  this.board.elements[pawn.x][pawn.y].select();
  this.board.elements[tile.x][tile.y].select();
}

PlayingState.prototype.picking = function (){

  if (this.scene.pickMode === false) {
    if (this.scene.pickResults !== null && this.scene.pickResults.length > 0) {
      for (var i=0; i< this.scene.pickResults.length; i++) {
        var obj = this.scene.pickResults[i][0];
        if (obj instanceof BoardElement)
        {
          var Id = this.scene.pickResults[i][1];
          console.log(Id);
          obj.select();
          switch (this.currentState) {
            case states.SELECT_PIECE:
                  this.pawnSelected=obj;
                  this.currentState=states.SELECT_TILE;
                  this.handleState();
              break;
            case states.SELECT_TILE:
            console.log(this.pawnSelected.piece.type);
                if(obj.piece !== null && this.pawnSelected.piece.type === obj.piece.type){//selecionou outro peao
                  this.pawnSelected.select();
                  this.handleTilesPicking(false);//disable das tiles do peao antigo
                  this.pawnSelected=obj;
                  this.handleState();
                }else{//selecionou uma tile
                  this.tileSelected = obj;
                  this.tryMove();

                }

              break;
            case states.SELECT_WALL:
              this.wallSelected=obj;
              this.currentState=states.SELECT_WALL_TILE;
              this.handleState();
              break;
            case states.SELECT_WALL_TILE:
              if(obj.piece.type != this.wallSelected.piece.type){
                this.wallSelected.select();
                this.wallSelected=obj;
              }

              break;
            default:

          }
        }
      }
      this.scene.pickResults.splice(0,this.scene.pickResults.length);
    }
  }
}

//faz o enable/disable das tiles em que é possivel jogar á volta da posicao x,y
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

PlayingState.prototype.tryMove = function (){
  //verificar movimentação de 2 espaços
  var offsetX= (this.tileSelected.x - this.pawnSelected.piece.x)/2;
  var offsetY= (this.tileSelected.y - this.pawnSelected.piece.y)/2;

  if(Math.abs(offsetX) + Math.abs(offsetY) == 2 ){
    console.log('offsetX: ' + offsetX + ' offsetY: ' + offsetY);
    var x1,y1,x2,y2;
    if(Math.abs(offsetX) == 1){
      x1=offsetX;
      y1=0;
      x2=0;
      y2=offsetY;
    }else{
      x1=offsetX/2;
      y1=offsetY/2;
      x2=offsetX/2;
      y2=offsetY/2;
    }
    this.moveRequest(true,x1,y1,x2,y2);
  }else
    this.moveRequest(false,offsetX,offsetY);

}

PlayingState.prototype.moveRequest = function (twospaces,x1,y1,x2,y2){

  var state=this;

  if(twospaces)
    this.client.getPrologRequest("move(" + state.pawnSelected.piece.identifier + ","
                                         + x1 + "," + y1 + ","
                                         + x2 + "," + y2 + ")",handleMoveResponse);
  else
    this.client.getPrologRequest("move(" + state.pawnSelected.piece.identifier + ","
                                         + x1 + "," + y1 + ")",handleMoveResponse);


    function handleMoveResponse(data) {

    console.log(data.target.responseText);
    var data = JSON.parse(data.target.responseText);
    var newPos = new Point2(data[0],data[1]);

    if(newPos.x == -1 && newPos.y == -1){//nao é possivel mover
      console.log('you cant move');
      //desselecionar a tile para onde é impossivel mover
      state.tileSelected.select();

    }else{//passar ao estado de animacao e atualizar variaveis
      var pawn = state.pawnSelected.piece;
      var oldPos = new Point2(pawn.x,pawn.y);

      state.plays[state.currentPlayId]= new Play(state.currentPlayId,oldPos, newPos);

      state.currentState=states.ANIMATE_PLAY;
      state.handleState();
    }
  }
}

PlayingState.prototype.setPawnPos = function (pawn){
  this.board.elements[pawn.x][pawn.y].setPiece(pawn);
}

PlayingState.prototype.clearPawnPos = function (pawn){
  this.board.elements[pawn.x][pawn.y].setPiece(null);
}

PlayingState.prototype.checkEnd = function (){
  this.client.getPrologRequest("checkEnd", function(data) {
      var data = JSON.parse(data.target.responseText);
      console.log(data);
  });
}
