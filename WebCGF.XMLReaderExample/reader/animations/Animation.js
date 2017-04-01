function Animation(id) {
  this.id = id;
  this.finished = false;
  this.render = false;
}


Animation.prototype.update = function(currTime) { };
Animation.prototype.getCurrentPosition = function() { };
Animation.prototype.getCurrentAngle = function() { };
