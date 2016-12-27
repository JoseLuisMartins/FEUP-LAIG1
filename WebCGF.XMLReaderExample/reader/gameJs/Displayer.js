/**
* Displayer
* @constructor
*/
function Displayer(scene, initialNumber) {
	CGFobject.call(this,scene);

    this.lastCurrTime = -1;
    this.left = new Rectangle(scene, new Point3(-1.005, 0), new Point3(-0.005, 1));
    this.right = new Rectangle(scene, new Point3(0.005, 0), new Point3(1.005, 1));

    this.numbers = {};
    for (var i = 0; i < 10; i++) {
        var path = "resources\\images\\numbers\\" + i + ".png";
        this.numbers[i] = new CGFtexture(scene, path);
    }

    this.leftAppearance = new CGFappearance(scene);
    this.rightAppearance = new CGFappearance(scene);
    this.setAllColors(1, 1, 1, 1);

    this.displayNumber = initialNumber;
    this.setNumber(initialNumber);
}

Displayer.prototype = Object.create(CGFobject.prototype);
Displayer.prototype.constructor = Displayer;


Displayer.prototype.display = function() {

    this.leftAppearance.apply();
		this.left.display();

    this.rightAppearance.apply();
    this.right.display();
};


Displayer.prototype.setNumber = function(number) {
    if (number < 0 || number > 99) {
        return;
    }

    this.displayNumber = number;

    var left = Math.floor(number / 10);
    var right = Math.floor(number % 10);

    this.leftAppearance.setTexture(this.numbers[left]);
    this.rightAppearance.setTexture(this.numbers[right]);
};


Displayer.prototype.decrement = function() {
    if (this.displayNumber === 0) {
        return;
    }

    this.displayNumber--;
    this.setNumber(this.displayNumber);
};

Displayer.prototype.increment = function() {
    if (this.displayNumber === 99) {
        return;
    }

    this.displayNumber++;
    this.setNumber(this.displayNumber);
};


Displayer.prototype.update = function(currTime) {
		if(this.displayNumber >= -0.1){
			if (this.lastCurrTime == -1) {
	        delta = 0;
	    }
	    else {
	        delta = (currTime - this.lastCurrTime) / 1000;
	    }
	    this.lastCurrTime = currTime;

	    this.displayNumber -= delta;
	    this.setNumber(this.displayNumber);
		}
};


Displayer.prototype.setAllColors = function(r, g, b, a) {
    this.leftAppearance.setAmbient(r, g, b, a);
	this.leftAppearance.setDiffuse(r, g, b, a);
	this.leftAppearance.setSpecular(r, g, b, a);

    this.rightAppearance.setAmbient(r, g, b, a);
	this.rightAppearance.setDiffuse(r, g, b, a);
	this.rightAppearance.setSpecular(r, g, b, a);
};
