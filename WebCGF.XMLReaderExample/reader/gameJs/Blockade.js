
function Blockade(scene){
  this.scene=scene;



  this.client= new Client();

  this.client.getPrologRequest("quit", function(data) {
  console.log(data.target.response);
  });

}

Blockade.prototype.constructor=Blockade;
