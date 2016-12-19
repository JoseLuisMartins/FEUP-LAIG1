
function Blockade(scene,mode){
  this.scene=scene;


  this.client= new Client();
  this.board = new Board(scene);


  this.init();
}

Blockade.prototype.constructor=Blockade;

Blockade.prototype.init = function (){

  this.orange1 = new Pawn(this.scene,"resources\\images\\abstractorange.jpg","orange1");
  this.orange2 = new Pawn(this.scene,"resources\\images\\abstractorange.jpg","orange2");
  this.yellow1 = new Pawn(this.scene,"resources\\images\\boardTex.png","yellow1");
  this.yellow2 = new Pawn(this.scene,"resources\\images\\boardTex.png","yellow2");

  this.waiting=0;

  this.updateAllPawnPositions();


}

Blockade.prototype.logPicking = function ()
{
	if (this.scene.pickMode == false) {
		if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
			for (var i=0; i< this.scene.pickResults.length; i++) {
				var obj = this.scene.pickResults[i][0];
				if (obj)
				{
					var Id = this.scene.pickResults[i][1];
          obj.select();
          console.log(obj);
					console.log("Picked with pick id " + Id);
				}
			}
			this.scene.pickResults.splice(0,this.scene.pickResults.length);
		}
	}
}

Blockade.prototype.display = function ()
{
  this.board.display();
}


Blockade.prototype.waitUpdatePositions = function(){

}

Blockade.prototype.updatePawnPosition = function(pawn){
  var game=this;

  this.client.getPrologRequest(pawn.identifier, function(data) {
    var parsed =JSON.parse(data.target.responseText);
    game.clearPawnPos(pawn);
    pawn.x=parsed[0];
    pawn.y=parsed[1];
    game.setPawnPos(pawn);
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
    this.state=new PlayingState(this.scene,this.board,this.orange1,this.orange2,this.yellow1,this.yellow2);

}


Blockade.prototype.setPawnPos = function (pawn){
  this.board.elements[pawn.x][pawn.y].setPiece(pawn);
}

Blockade.prototype.clearPawnPos = function (pawn){
  this.board.elements[pawn.x][pawn.y].setPiece(null);
}
