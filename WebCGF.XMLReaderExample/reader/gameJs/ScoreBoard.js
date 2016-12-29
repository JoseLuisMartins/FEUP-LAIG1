/**
* ScoreBoard
* @constructor
*/
function ScoreBoard(scene) {
	CGFobject.call(this,scene);

	this.body = new Cube(scene,true);
	this.timer = new Displayer(scene, 5);
	this.orangeScore = new Displayer(scene, 0);
	this.yellowScore = new Displayer(scene, 0);

  	this.bodyAppearance = new CGFappearance(scene);
	this.bodyAppearance.loadTexture("resources\\images\\scoreBoard.png");

	this.holderAppearance = new CGFappearance(scene);
	this.holderAppearance.loadTexture("resources\\images\\metal2.jpg");

	this.holder= new Cylinder(scene, 0.1, 0.1, 1, 15, 5);
	this.holderBase= new Cube(scene,false);
}

ScoreBoard.prototype = Object.create(CGFobject.prototype);
ScoreBoard.prototype.constructor = ScoreBoard;


ScoreBoard.prototype.display = function() {

	this.holderAppearance.apply();
	this.scene.pushMatrix();
	this.scene.translate(0,-1,0);
	this.scene.rotate(Math.PI/2,1,0,0);
	this.holder.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0,-2,0);
	this.scene.scale(0.5,0.1,0.5);
	this.holderBase.display();
	this.scene.popMatrix();


  this.bodyAppearance.apply();

	this.scene.pushMatrix();
        this.scene.scale(3, 2, 0.2);
  		this.body.display();
	this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, 0.4, 0.11);
        this.scene.scale(0.5, 0.5, 1);
  		this.timer.display();
	this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(-0.8, -0.5, 0.11);
        this.scene.scale(0.5, 0.5, 1);
  		this.orangeScore.display();
	this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0.8, -0.5, 0.11);
        this.scene.scale(0.5, 0.5, 1);
  		this.yellowScore.display();
	this.scene.popMatrix();
};


ScoreBoard.prototype.update = function(currTime) {
    this.timer.update(currTime);
};

ScoreBoard.prototype.resetTimer = function() {
    this.timer.setNumber(5);
};

ScoreBoard.prototype.setTimer = function(number) {
    this.timer.setNumber(number);
};

ScoreBoard.prototype.getTime = function() {
    return this.timer.displayNumber;
};

ScoreBoard.prototype.orangeWin = function() {
    this.orangeScore.increment();
};

ScoreBoard.prototype.yellowWin = function() {
    this.yellowScore.increment();
};
