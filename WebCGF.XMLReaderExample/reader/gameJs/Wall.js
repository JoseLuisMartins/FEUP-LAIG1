/**
* Wall
* @constructor
*/
function Wall(scene,texture,type) {
	CGFobject.call(this,scene);
  this.scene=scene;

  this.material = new CGFappearance(scene);
  this.material.setTexture(texture);

  this.type=type;
  if(this.type == "h")
    this.scaleParam = new Point3(1,1,0.2);
  else
    this.scaleParam = new Point3(0.2,1,1);

  this.body = new Cube(scene);


}

Wall.prototype = Object.create(CGFobject.prototype);
Wall.prototype.constructor = Wall;


Wall.prototype.display = function() {

  this.scene.pushMatrix();
  this.material.apply();
	this.scene.translate(0, 0, 0.7);
	this.scene.rotate(-Math.PI/2,1,0,0);
  this.scene.scale(this.scaleParam.x,this.scaleParam.y,this.scaleParam.z);
  this.body.display();


	this.scene.popMatrix();
};
