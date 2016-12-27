/**
* ScoreBoard
* @constructor
*/
function ScoreBoard(scene) {
	CGFobject.call(this,scene);

	this.body = new Cube(scene);
    this.timer = new Displayer(scene, 10);
    this.orangeScore = new Displayer(scene, 0);
    this.yellowScore = new Displayer(scene, 0);


    this.bodyAppearance = new CGFappearance(scene);
	this.bodyAppearance.loadTexture("resources\\images\\wood_light.jpg");
}

ScoreBoard.prototype = Object.create(CGFobject.prototype);
ScoreBoard.prototype.constructor = ScoreBoard;


ScoreBoard.prototype.display = function() {

    this.bodyAppearance.apply();
	this.scene.pushMatrix();
        this.scene.scale(2, 2, 0.2);
  		this.body.display();
	this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0, 0.4, 0.11);
        this.scene.scale(0.5, 0.5, 1);
  		this.timer.display();
	this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(-0.5, -0.5, 0.11);
        this.scene.scale(0.4, 0.4, 1);
  		this.orangeScore.display();
	this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0.5, -0.5, 0.11);
        this.scene.scale(0.4, 0.4, 1);
  		this.yellowScore.display();
	this.scene.popMatrix();
};


ScoreBoard.prototype.update = function(currTime) {
    this.timer.update(currTime);
};

ScoreBoard.prototype.resetTimer = function() {
    this.timer.setNumber(11);
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
