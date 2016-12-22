var states={
  SELECT_PIECE: 1,
  SELECT_TILE: 2,
  FIRST_MOVE: 3,
  SECOND_MOVE: 4,
  SELECT_WALL: 5,
  SELECT_WALL_TILE: 6,
  ANIMATE_WALL: 7,
  CHANGE_PLAYER: 8,
};

var players={
  ORANGE: 1,
  YELLOW: 2,
};


function PlayingState(scene,client,board,wallBoardOrange,wallBoardYellow,orange1,orange2,yellow1,yellow2){

  this.scene=scene;
  //game
  //boards
  this.board=board;
  this.wallBoardOrange=wallBoardOrange;
  this.wallBoardYellow=wallBoardYellow;
  this.currentState= states.SELECT_PIECE;
  this.currentPlayer= players.ORANGE;

  //game cycle
  this.pawnTileSelected= null;
  this.pawnPieceSelected= null;
  this.tileSelected= null;
  this.wallSelected= null;
  this.wallTileSelected= null;

  //pawns
  this.orange1=orange1;
  this.orange2=orange2;
  this.yellow1=yellow1;
  this.yellow2=yellow2;

  //walls
  var greenTex=new CGFtexture(scene, "resources\\images\\green.png");
  var blueTex=new CGFtexture(scene, "resources\\images\\blue.jpg");
  this.greenWall=new Wall(scene,greenTex,"v");
  this.blueWall=new Wall(scene,blueTex,"h");

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
          //Initialize new play class
          this.plays[this.currentPlayId]= new Play(this.currentPlayId);
          this.handlePiecePicking(true);
      break;
    case states.SELECT_TILE:
          this.handleTilesPicking(true);
      break;
    case states.FIRST_MOVE:
          this.handleMovement();

          //selecionar o peao a ser movido
          var pawn=this.pawnPieceSelected;
          this.pawnTileSelected=this.board.elements[pawn.x][pawn.y];
          this.pawnTileSelected.select();
          //dar enable das tiles
          this.handleTilesPicking(true);
      break;
    case states.SECOND_MOVE:
          this.handleMovement();
          //se ouver parede posicionar uma senão passar para o proximo jogador
          this.checkHasWalls();
      break;
    case states.SELECT_WALL:

      break;
    case states.SELECT_WALL_TILE:
          this.handleWallTilesPicking(true);
      break;
    case states.ANIMATE_WALL:
          //tornar as paredes nao selicionaveis novamente
          this.handleWallTilesPicking(false);
          //tornar o tabuleiro auxiliar nao selicionavel novamente
          this.handleWallPicking(false);
          //tornar o elemento da parede do board e do board auxiliar não selecionado
          this.wallTileSelected.select();
          this.wallSelected.select();
          //posicionar a parede
          this.animateWall();
          this.currentState=states.CHANGE_PLAYER;
          this.handleState();
      break;
    case states.CHANGE_PLAYER://animaçao da camera
          //proximo jogador js
          if(this.currentPlayer==players.ORANGE)
            this.currentPlayer=players.YELLOW;
          else
            this.currentPlayer=players.ORANGE;

          this.resetVariables();

          //proximo jogador prolog
          this.changePlayer();

      break;
    default:

  }
};

PlayingState.prototype.resetVariables = function (){
  this.pawnTileSelected= null;
  this.pawnPieceSelected= null;
  this.tileSelected= null;
  this.wallSelected= null;
  this.wallTileSelected= null;
};

PlayingState.prototype.handleMovement = function (){
  //tornar tiles da ultima jogada nao selecionaveis
  this.handleTilesPicking(false);
  //tornar as pecas do jogador atual nao selecionaveis,para preparar o proximo movimento
  this.handlePiecePicking(false);
  //e desselecionar peça e tile selecionada no decorrer da jogada
  this.deselectPlayElements();
  //fazer animaçao - mover
  this.animatePawn();
  //verificar se ganhou
  this.checkEnd();
};


PlayingState.prototype.changePlayer = function (enable){
    var state=this;

    this.client.getPrologRequest("changePlayer",handleChangePlayerRequest);

    function handleChangePlayerRequest(data) {
      //proximo estado
      state.currentState=states.SELECT_PIECE;
      state.handleState();
    }

};

PlayingState.prototype.checkHasWalls = function (enable){
    var state=this;

    this.client.getPrologRequest("hasWalls(" +   this.pawnPieceSelected.type + ")",handleCheckWallRequest);


    function handleCheckWallRequest(data){
      console.log(data.target.responseText);
      var numberWalls = JSON.parse(data.target.responseText);

      var blueWallsNumber = numberWalls[0];
      var greenWallsNumber = numberWalls[1];

      var total = blueWallsNumber + greenWallsNumber;

      if(total === 0)//não exitem mais paredes para posicionar
        state.currentState=states.CHANGE_PLAYER;
      else{
        state.currentState=states.SELECT_WALL;

        if(state.currentPlayer == players.ORANGE)
          enableWallPick(blueWallsNumber,greenWallsNumber,state.wallBoardOrange);
        else
          enableWallPick(blueWallsNumber,greenWallsNumber,state.wallBoardYellow);
      }

      state.handleState();
    }

    function enableWallPick(blueWallsNumber,greenWallsNumber,board){
      if(blueWallsNumber > 0)
        board.handleSelectionBlueWall(true);

      if(greenWallsNumber > 0)
        board.handleSelectionGreenWall(true);
    }

};


PlayingState.prototype.handleWallPicking = function (enable){
  if(this.currentPlayer==players.ORANGE)
    this.wallBoardOrange.handleSelection(enable);
  else
    this.wallBoardYellow.handleSelection(enable);

};

PlayingState.prototype.handleWallTilesPicking = function (enable){
  //enable/disable wall tile
  var walls = this.board.getWallTiles();
  for (var i = 0; i < walls.length; i++) {
    walls[i].handleSelection(enable);
  }
};


PlayingState.prototype.animatePawn = function (){
  var pawn = this.pawnPieceSelected;
  //dados da jogada
  var play = this.plays[this.currentPlayId];
  //limpar posicao atual do peao
  this.clearPawnPos(pawn);
  //atualizar posicao do peao
  pawn.x = play.pawnEnd.x;
  pawn.y = play.pawnEnd.y;

  //este set depois deve ser uma animacao
  this.setPawnPos(pawn);

};

PlayingState.prototype.animateWall = function (){
  var play = this.plays[this.currentPlayId];

  var wallx=play.wallCoords.x;
  var wally=play.wallCoords.y;

  //need to animate this
  if(play.wallOrientation == "h"){
    this.board.elements[wallx][wally].setPiece(this.blueWall);
    this.board.elements[wallx+1][wally].setPiece(this.blueWall);
    this.board.elements[wallx+2][wally].setPiece(this.blueWall);
  }else{
    this.board.elements[wallx][wally].setPiece(this.greenWall);
    this.board.elements[wallx][wally+1].setPiece(this.greenWall);
    this.board.elements[wallx][wally+2].setPiece(this.greenWall);
  }

};


PlayingState.prototype.handlePiecePicking = function (enable){

  if(this.currentPlayer == players.ORANGE) {
    this.board.elements[this.orange1.x][this.orange1.y].handleSelection(enable);
    this.board.elements[this.orange2.x][this.orange2.y].handleSelection(enable);
  }else {
    this.board.elements[this.yellow1.x][this.yellow1.y].handleSelection(enable);
    this.board.elements[this.yellow2.x][this.yellow2.y].handleSelection(enable);
  }

};

PlayingState.prototype.deselectPlayElements = function (enable){
  var pawn = this.pawnTileSelected;
  var tile = this.tileSelected;
  this.board.elements[pawn.x][pawn.y].select();
  this.board.elements[tile.x][tile.y].select();
};

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
                  this.pawnTileSelected=obj;
                  this.pawnPieceSelected=obj.piece;
                  this.currentState=states.SELECT_TILE;
                  this.handleState();
              break;
            case states.SELECT_TILE:
                if(obj.piece !== null && this.pawnPieceSelected.type === obj.piece.type){//selecionou outro peao
                  this.pawnTileSelected.select();
                  this.handleTilesPicking(false);//disable das tiles do peao antigo
                  this.pawnTileSelected=obj;
                  this.pawnPieceSelected=this.pawnTileSelected.piece;
                  this.handleState();
                }else{//selecionou uma tile
                  this.tileSelected = obj;
                  this.tryMove();

                }
                break;
            case states.FIRST_MOVE:
                  //proximo estado
                  this.tileSelected = obj;
                  this.tryMove();
              break;
            case states.SELECT_WALL:
              this.wallSelected=obj;
              this.currentState=states.SELECT_WALL_TILE;
              this.handleState();
              break;
            case states.SELECT_WALL_TILE:
              if(obj.piece instanceof Wall && obj.piece.type !== this.wallSelected.piece.type){
                this.wallSelected.select();
                this.wallSelected=obj;
              }else{
                this.wallTileSelected=obj;
                this.tryPlaceWall();

              }

              break;
            default:

          }
        }
      }
      this.scene.pickResults.splice(0,this.scene.pickResults.length);
    }
  }
};

//faz o enable/disable das tiles em que é possivel jogar á volta da posicao x,y
PlayingState.prototype.handleTilesPicking = function (enable){
  var x = this.pawnPieceSelected.x;
  var y = this.pawnPieceSelected.y;

  handleTilePicking(x-2, y, this.board.elements,enable);
  handleTilePicking(x+2, y, this.board.elements,enable);
  handleTilePicking(x, y-2, this.board.elements,enable);
  handleTilePicking(x, y+2, this.board.elements,enable);
};

function handleTilePicking(x,y,elements,enable){
  if(x >= 0 && x <= 20 && y >= 0 && y <= 26)
    elements[x][y].handleSelection(enable);
}


PlayingState.prototype.tryMove = function (){

  var state=this;
  var offsetX= (this.tileSelected.x - this.pawnPieceSelected.x)/2;
  var offsetY= (this.tileSelected.y - this.pawnPieceSelected.y)/2;

  this.client.getPrologRequest("move(" + state.pawnPieceSelected.identifier + "," + offsetX + "," + offsetY + ")",handleMoveResponse);


    function handleMoveResponse(data) {


    var Posdata = JSON.parse(data.target.responseText);
    var newPos = new Point2(Posdata[0],Posdata[1]);

    if(newPos.x == -1 && newPos.y == -1){//nao é possivel mover
      console.log('you cant move');
      //desselecionar a tile para onde é impossivel mover
      state.tileSelected.select();

    }else{//passar ao estado de animacao e atualizar variaveis
      var pawn = state.pawnPieceSelected;
      var oldPos = new Point2(pawn.x,pawn.y);

      state.plays[state.currentPlayId].setPlayerData(oldPos, newPos);


      if(state.currentState == states.SELECT_TILE)
        state.currentState=states.FIRST_MOVE;
      else
        state.currentState=states.SECOND_MOVE;

      state.handleState();
    }
  }
};

PlayingState.prototype.tryPlaceWall = function (){
  var state=this;

  var wallX = this.wallTileSelected.x;
  var wallY = this.wallTileSelected.y;
  var wallType = this.wallSelected.piece.type;

  if(wallType == "h"){
    if(wallX % 2 == 1)
      wallX++;

    if(wallY % 2 === 0)
      wallY++;
  }else{
    if(wallX % 2 === 0)
      wallX++;

    if(wallY % 2 == 1)
      wallY++;
  }


  this.client.getPrologRequest("placewall(" + this.pawnPieceSelected.type + "," +  wallX + "," +
                                wallY + "," + wallType + ")", handleWallResponse);

  function handleWallResponse(data) {


    if(data.target.responseText == "1"){//passar para o proximo estado e posicionar a parede

      state.plays[state.currentPlayId].setWallData(new Point2(wallX,wallY), wallType);
      state.currentState=states.ANIMATE_WALL;
      state.handleState();

    }else {//nao foi possivel posicionar a parede
      state.wallTileSelected.select();
    }

  }
};







PlayingState.prototype.setPawnPos = function (pawn){
  this.board.elements[pawn.x][pawn.y].setPiece(pawn);
};

PlayingState.prototype.clearPawnPos = function (pawn){
  this.board.elements[pawn.x][pawn.y].setPiece(null);
};

PlayingState.prototype.checkEnd = function (){
  this.client.getPrologRequest("checkEnd", function(data) {
      var Resdata = JSON.parse(data.target.responseText);
      console.log(Resdata);
  });
};
