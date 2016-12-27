/**
* Button
* @constructor
*/
function Button(scene) {
	CGFobject.call(this,scene);

	this.body = new Cube(scene);
    this.animation = null;
}

Button.prototype = Object.create(CGFobject.prototype);
Button.prototype.constructor = Button;


Button.prototype.display = function() {

	this.scene.pushMatrix();
        if (this.animation !== null) {
            var pos = this.animation.getCurrentPosition();
            this.scene.translate(pos.x, pos.y, pos.z);
        }
		this.scene.scale(6, 2, 0.2);
        this.scene.translate(0, 0.5, 0);
        this.body.display();
	this.scene.popMatrix();
};


Button.prototype.update = function(currTime) {
    if (this.animation !== null) {
        this.animation.update(currTime);
    }
};


Button.prototype.click = function() {
    this.animation = new KeyframeAnimation("w/e", 2,
                        [new Point3(0, 0, 0), new Point3(0, 0, -5), new Point3(0, 0, 0)],
                        [0, 0, 0], 
                        [new Point3(0, 0, 0), new Point3(0, 0, 0), new Point3(0, 0, 0)]);
    this.animation.render = true;
};