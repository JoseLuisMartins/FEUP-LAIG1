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

var mode={
  HUMAN_VS_HUMAN: 1,
  HUMAN_VS_BOT: 2,
};



function PlayingState(scene,client,board,wallBoardOrange,wallBoardYellow,orange1,orange2,yellow1,yellow2,gameMode,gameDifficulty){

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
  this.mode = gameMode;
  this.gameDifficulty=gameDifficulty;
  this.gameEnded=false;


  //pawns
  this.orange1=orange1;
  this.orange2=orange2;
  this.yellow1=yellow1;
  this.yellow2=yellow2;

  //walls
  var greenTex=new CGFtexture(scene, "resources\\images\\green.png");
  var blueTex=new CGFtexture(scene, "resources\\images\\blue.png");
  this.greenWall=new Wall(scene,greenTex,"v");
  this.blueWall=new Wall(scene,blueTex,"h");

  //conection
  this.waitingForRequest=false;
  this.client=client;

  //game story
  this.currentPlayId=0;
  this.plays={};

  //animations
  this.animating=false;
  this.animation=null;
  this.animationObject=null;

  this.handleState();
}


PlayingState.prototype.constructor=PlayingState;


PlayingState.prototype.display = function (){
  this.scene.pushMatrix();

  this.board.display();

  this.scene.pushMatrix();
  this.scene.translate(10,0,-4);
  this.wallBoardOrange.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  this.scene.translate(20,0,-11.8);
  this.scene.rotate(Math.PI,0,1,0);
  this.wallBoardYellow.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
  if(this.animating){
    if(this.animation.finished){
      this.animating=false;
      this.setPawnPos(this.animationObject);
    }

    var pos = this.animation.getCurrentPosition();
    var ang = this.animation.getCurrentAngle();
    this.scene.translate(pos.x, pos.y, pos.z);
    this.scene.rotate(ang.x  - Math.PI/2, 1, 0, 0);
    this.scene.rotate(ang.y, 0, 1, 0);
    this.scene.rotate(ang.z, 0, 0, 1);
    this.animationObject.display();
  }
  this.scene.popMatrix();


  this.scene.popMatrix();

};

PlayingState.prototype.update = function (currtime){
    if(this.animation !== null)
      this.animation.update(currtime);
};


PlayingState.prototype.handleState = function (){
  switch (this.currentState) {
    case states.SELECT_PIECE:

          this.plays[this.currentPlayId]= new Play(this.currentPlayId);
          this.handlePiecePicking(true);
      break;
    case states.SELECT_TILE:
          if(this.pawnPieceSelected !==null)
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
          this.animateWall(true);
          this.currentState=states.CHANGE_PLAYER;
          this.handleState();
      break;
    case states.CHANGE_PLAYER://animaçao da camera
          if(this.plays[this.currentPlayId].wallCoords === null){
            this.prepareForNextRound(this);
            this.changePlayer();
          }else
            this.handleNextButon(true);


      break;
    default:

  }
};

PlayingState.prototype.handleNextButon = function (enable){
  if(this.currentPlayer==players.ORANGE)
    this.wallBoardOrange.handleSelectionButton(enable);
  else
    this.wallBoardYellow.handleSelectionButton(enable);
};

PlayingState.prototype.undo = function (){
  console.log("-------------------------undo----------------------");




    if((this.mode == mode.HUMAN_VS_HUMAN) || ((this.mode == mode.HUMAN_VS_BOT && this.currentPlayer == players.ORANGE))){

      var currentPlay = this.plays[this.currentPlayId];
      //alterar play atual para reverter peao

      if(currentPlay.wallCoords !== null){// já posicionou as paredes
          this.undoWall(currentPlay.pawn.type,
                        currentPlay.wallCoords.x,
                        currentPlay.wallCoords.y,
                        currentPlay.wallOrientation);
      }else if(currentPlay.start2 !== null) {//já fez o segundo movimento

      }else if(currentPlay.start1 !== null){//já fez o primeiro movimento

      }


      //currentPlay.reset();

      //depois do prolog request

    }


};

PlayingState.prototype.undoWall = function (player,wallX,wallY,orientation){
  var state = this;

  this.client.getPrologRequest("undoWall(" + player + "," + wallX + "," + wallY + "," + orientation + ")", function(data) {
      console.log(data.target.responseText);

      state.animateWall(false);//retirar parede javascript
      state.checkHasWalls();

    });

};


PlayingState.prototype.prepareForNextRound = function (context){
  //proximo jogador js
  if(context.currentPlayer==players.ORANGE)
    context.currentPlayer=players.YELLOW;
  else
    context.currentPlayer=players.ORANGE;

  context.resetVariables();
  //passar para a proxima jogada
  context.currentPlayId++;
  //proximo jogador prolog
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

PlayingState.prototype.checkEnd = function (){
  var state = this;
  this.client.getPrologRequest("checkEnd", function(data) {
      var Resdata = JSON.parse(data.target.responseText);
      console.log("Jogo terminou: " + Resdata);

      if(Resdata == 1)
        state.gameEnded=true;
  });
};


PlayingState.prototype.changePlayer = function (enable){
    var state=this;

    this.client.getPrologRequest("changePlayer",handleChangePlayerRequest);

    function handleChangePlayerRequest(data) {
      //proximo estado
      if(state.mode == mode.HUMAN_VS_BOT){// player vs bot
        state.playBot();
      }else if(mode.HUMAN_VS_HUMAN){
        state.currentState=states.SELECT_PIECE;
        state.handleState();
      }
    }

};

PlayingState.prototype.playBot = function (){
    var state=this;

    var pawnType;
    //request para ir busacar a jogada do bot e depois trocar para o jogador humano
    if(this.currentPlayer==players.ORANGE)
      pawnType = "orange";
    else
      pawnType = "yellow";

    this.client.getPrologRequest("botPlay(" + pawnType + "," + this.gameDifficulty + ")",handleBotPlayRequest);


    function handleBotPlayRequest(data){

      var botPlay = JSON.parse(data.target.responseText);
      console.log(botPlay);

      //pawn
      var pawnId = botPlay[0];
      var pawnEndx = botPlay[1];
      var pawnEndy = botPlay[2];

      var pawnIdentifier = "[" + pawnType + "," + pawnId + "]" ;

      var currentPawn;
      if(pawnType == "orange"){
        if(pawnId == 1)
          currentPawn=state.orange1;
        else
          currentPawn=state.orange2;
      }else {
        if(pawnId == 1)
          currentPawn=state.yellow1;
        else
          currentPawn=state.yellow2;
      }

      var pawnStartX = currentPawn.x;
      var pawnStartY = currentPawn.y;

      //walls
      var wallOrientation;
      if(botPlay[3] === 0)
        wallOrientation="h";
      else if( botPlay[3] == 1)
        wallOrientation="v";
      else //nao foi possivel posicionar parede
          wallOrientation="x";


      var wallX = botPlay[4];
      var wallY = botPlay[5];

      //build play
      var play=new Play(state.currentPlayId);
      console.log(wallX);
      console.log(wallY);

      play.setPlayerData1(new Point2(pawnStartX,pawnStartY),
                          null,
                          currentPawn);

      play.setPlayerData2(null,
                          new Point2(pawnEndx,pawnEndy));


      state.plays[state.currentPlayId]=play;

      //make the play
      state.pawnPieceSelected=currentPawn;
      state.animatePawn();

      if(wallOrientation != "x")//se foi possivel posicionar uma parede
        play.setWallData(new Point2(wallX,wallY),wallOrientation);


      state.animateWall(true);

      //next state
      state.prepareForNextRound(state);

      if(state.mode == mode.HUMAN_VS_BOT){// player vs bot, voltar á maquina de estados
        state.currentState=states.SELECT_PIECE;
        state.handleState();
      }


    }

};


PlayingState.prototype.checkHasWalls = function (){
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
      board.handleSelectionButton(true);

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

  //dados da jogada
  var play = this.plays[this.currentPlayId];
  var pawn = play.pawn;
  //limpar posicao atual do peao
  this.clearPawnPos(pawn);

  var oldx=pawn.x*0.6;
  var oldy=-pawn.y*0.6;

  //atualizar posicao do peao
  if(this.currentState == states.FIRST_MOVE){
    pawn.x = play.end1.x;
    pawn.y = play.end1.y;
  }else{
    pawn.x = play.end2.x;
    pawn.y = play.end2.y;
  }


  var newx=pawn.x*0.6;
  var newy=pawn.y*0.6;

  //animacao
  this.animating=true;
  this.animationObject=pawn;

  var controlPoints= new Array(3);
  controlPoints[0]= new Point3(oldx, 0 , oldy);
  controlPoints[1]= new Point3(oldx + (newx-oldx)/2, 1, oldy + (-newy - oldy)/2);
  controlPoints[2]= new Point3(newx , 0, - newy);

  var slopes = [0,0,0];

  var angles= new Array(3);
  angles[0]= new Point3(0,0,0);
  angles[1]= new Point3(0,0,0);
  angles[2]= new Point3(0,0,0);

  this.animation= new KeyframeAnimation("boas", 0.5, controlPoints, slopes, angles);
  this.animation.render=true;

};

PlayingState.prototype.animateWall = function (placeWall){
  var play = this.plays[this.currentPlayId];

  var wallx=play.wallCoords.x;
  var wally=play.wallCoords.y;

  var piece;

  if(!placeWall)
    piece=null;
  else if(play.wallOrientation == "h")
    piece=this.blueWall;
  else if(play.wallOrientation == "v")
    piece=this.greenWall;

  //animation
  /*
  this.animating=true;
  this.animationObject=piece;

  var controlPoints= new Array(3);
  controlPoints[0]= new Point3(oldx, 0 , oldy);
  controlPoints[1]= new Point3(oldx + (newx-oldx)/2, 1, oldy + (-newy - oldy)/2);
  controlPoints[2]= new Point3(newx , 0, - newy);

  var slopes = [0,0,0];

  var angles= new Array(3);
  angles[0]= new Point3(0,0,0);
  angles[1]= new Point3(0,0,0);
  angles[2]= new Point3(0,0,0);

  this.animation= new KeyframeAnimation("oi", 0.5, controlPoints, slopes, angles);
  this.animation.render=true;*/


  //need to animate this
  if(play.wallOrientation == "h"){
    this.board.elements[wallx][wally].setPiece(piece);
    this.board.elements[wallx+1][wally].setPiece(piece);
    this.board.elements[wallx+2][wally].setPiece(piece);
  }else if(play.wallOrientation == "v"){
    this.board.elements[wallx][wally].setPiece(piece);
    this.board.elements[wallx][wally+1].setPiece(piece);
    this.board.elements[wallx][wally+2].setPiece(piece);
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
                  this.pawnPieceSelected=obj.piece;
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

              if(Id === 10000){//botao
                this.currentState=states.CHANGE_PLAYER;
                this.handleWallPicking(false);
                obj.select();
              }
              else
                this.currentState=states.SELECT_WALL_TILE;

              this.handleState();
              break;
            case states.SELECT_WALL_TILE:
            if(Id === 10000){//botao
              this.currentState=states.CHANGE_PLAYER;
              this.handleWallTilesPicking(false);
              this.wallSelected.select();
              obj.select();
              this.handleWallPicking(false);
              this.handleState();
            }else if(obj.piece instanceof Wall && obj.piece.type !== this.wallSelected.piece.type){
                this.wallSelected.select();
                this.wallSelected=obj;
            }else{
              this.wallTileSelected=obj;
              this.tryPlaceWall();

            }

              break;
            case states.CHANGE_PLAYER:
                this.handleNextButon(false);
                obj.select();
                this.prepareForNextRound(this);
                this.changePlayer();
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
      var play=state.plays[state.currentPlayId];




      if(state.currentState == states.SELECT_TILE){
        state.currentState=states.FIRST_MOVE;
        play.setPlayerData1(oldPos, newPos, pawn);
      }else{
        state.currentState=states.SECOND_MOVE;
        play.setPlayerData2(oldPos, newPos);
      }

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
