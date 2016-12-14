
function Blockade(scene,mode){
  this.scene=scene;


  this.client= new Client();
  this.board = new Board(scene);


  this.init();
}

Blockade.prototype.constructor=Blockade;

Blockade.prototype.init = function (){

  this.orange1 = new Pawn(this.scene,null);
  this.orange2 = new Pawn(this.scene,null);
  this.yellow1 = new Pawn(this.scene,null);
  this.yellow2 = new Pawn(this.scene,null);

  this.updatePawnPos();

  this.state=new PlayingState(this.scene,this.board,this.orange1,this.orange2,this.yellow1,this.yellow2);
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

Blockade.prototype.updatePawnPos = function ()
{
  var game=this;
  console.log(game.orange1.x);

  this.client.getPrologRequest("orange1", function(data) {
    var parsed =JSON.parse(data.target.responseText);
    game.orange1.x=parsed[0];
    game.orange1.y=parsed[1];
    game.setPawnPos(game.orange1);

  });

  this.client.getPrologRequest("orange2", function(data) {
    var parsed =JSON.parse(data.target.responseText);
    game.orange2.x=parsed[0];
    game.orange2.y=parsed[1];
    game.setPawnPos(game.orange2);
  });

  this.client.getPrologRequest("yellow1", function(data) {
    var parsed =JSON.parse(data.target.responseText);
    game.yellow1.x=parsed[0];
    game.yellow1.y=parsed[1];
    game.setPawnPos(game.yellow1);
  });

  this.client.getPrologRequest("yellow2", function(data) {
    var parsed =JSON.parse(data.target.responseText);
    game.yellow2.x=parsed[0];
    game.yellow2.y=parsed[1];
    game.setPawnPos(game.yellow2);
  });
console.log(game.orange1.x);
}

Blockade.prototype.setPawnPos = function (pawn){
  //clear last possition

  //set new position

  this.board.elements[pawn.x][pawn.y].setPiece(pawn);

}
