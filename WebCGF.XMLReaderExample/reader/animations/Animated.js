/**
* Animated
* @constructor
*/
function Animated(animations) {
  this.animations = animations;

  this.animationIndex = 0;
  this.animations[0].render = true;
};


Animated.prototype.getAnimationPosition = function() {
  if (this.animations[this.animationIndex].finished &&
      this.animationIndex != this.animations.length-1) {
        this.animationIndex++;
        this.animations[this.animationIndex].render = true;
      }

	return this.animations[this.animationIndex].getCurrentPosition();
}


Animated.prototype.getAnimationAngle = function() {
	return this.animations[this.animationIndex].getCurrentAngle();
}

Animated.prototype.getAnimationMatrix = function() {

  var matrix = mat4.create();

  mat4.translate(matrix, matrix, this.getAnimationPosition().toArray());
  mat4.rotate(matrix, matrix,this.getAnimationAngle(), [0,1,0]);

  return matrix;
}
