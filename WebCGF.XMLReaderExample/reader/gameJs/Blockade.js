
function Blockade(scene){
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
  this.client.getPrologRequest("orange1", function(data) {

    var parsed =JSON.parse(data.target.responseText);
    game.setPawnPos(parsed[0],parsed[1],game.orange1);
  });

  this.client.getPrologRequest("orange2", function(data) {
    var parsed =JSON.parse(data.target.responseText);

    game.setPawnPos(parsed[0],parsed[1],game.orange2);
  });

  this.client.getPrologRequest("yellow1", function(data) {
    var parsed =JSON.parse(data.target.responseText);

    game.setPawnPos(parsed[0],parsed[1],game.yellow1);
  });

  this.client.getPrologRequest("yellow2", function(data) {
    var parsed =JSON.parse(data.target.responseText);

    game.setPawnPos(parsed[0],parsed[1],game.yellow2);
  });
}

Blockade.prototype.setPawnPos = function (x,y,pawn){
  //clear last possition

  //set new position
  console.log(pawn);
  this.board.elements[x][y].setPiece(pawn);
}
