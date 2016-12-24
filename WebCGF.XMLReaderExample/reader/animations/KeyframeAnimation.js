function KeyframeAnimation(id, span, controlPoints, slopes, angles) {
  Animation.call(this, id);

  this.span = span;
  this.controlPoints = controlPoints;
  this.slopes = slopes;
  this.angles = angles;

  this.currentControlPoint = 0;
  this.switchTime = span / (controlPoints.length - 1);
  this.lastCurrTime = -1;
  this.timeElapsed = 0;

  this.currentPosition = controlPoints[0];
  this.currentAngle = angles[0];
}


KeyframeAnimation.prototype = Object.create(Animation.prototype);
KeyframeAnimation.prototype.constructor = KeyframeAnimation;


KeyframeAnimation.prototype.update = function(currTime) {
  var delta, t, x, y, z, h00, h10, h01, h11;

  if (!this.render)
    return;


  if (this.timeElapsed >= this.switchTime) {
      this.currentControlPoint++;
      this.timeElapsed = 0;
  }

  if (this.currentControlPoint == this.controlPoints.length - 1) {
    this.finished = true;
    this.render = false;
    return;
  }

  if (this.lastCurrTime == -1) {
    delta = 0;
  }
  else {
    delta = (currTime - this.lastCurrTime) / 1000;
  }

  this.lastCurrTime = currTime;
  this.timeElapsed += delta;

  t = this.timeElapsed / this.switchTime;
  h00 = this.h00(t);
  h10 = this.h10(t);
  h01 = this.h01(t);
  h11 = this.h11(t);

  x = h00 * this.controlPoints[this.currentControlPoint].x +
      h10 * this.slopes[this.currentControlPoint] +
      h01 * this.controlPoints[this.currentControlPoint + 1].x +
      h11 * this.slopes[this.currentControlPoint + 1];

  y = h00 * this.controlPoints[this.currentControlPoint].y +
      h10 * this.slopes[this.currentControlPoint] +
      h01 * this.controlPoints[this.currentControlPoint + 1].y +
      h11 * this.slopes[this.currentControlPoint + 1];

  z = h00 * this.controlPoints[this.currentControlPoint].z +
      h10 * this.slopes[this.currentControlPoint] +
      h01 * this.controlPoints[this.currentControlPoint + 1].z +
      h11 * this.slopes[this.currentControlPoint + 1];

  ax = h00 * this.angles[this.currentControlPoint].x +
       h01 * this.angles[this.currentControlPoint + 1].x;

  ay = h00 * this.angles[this.currentControlPoint].y +
       h01 * this.angles[this.currentControlPoint + 1].y;

  az = h00 * this.angles[this.currentControlPoint].z +
       h01 * this.angles[this.currentControlPoint + 1].z;

  this.currentPosition.set(x, y, z);
  this.currentAngle.set(ax, ay, az);
};



KeyframeAnimation.prototype.getCurrentPosition = function() {
  return this.currentPosition;
};


KeyframeAnimation.prototype.getCurrentAngle = function() {
  return this.currentAngle;
};


KeyframeAnimation.prototype.h00 = function(t) {
  return 2*Math.pow(t, 3) - 3*Math.pow(t, 2) + 1;
};

KeyframeAnimation.prototype.h10 = function(t) {
  return Math.pow(t, 3) - 2*Math.pow(t, 2) + t;
};

KeyframeAnimation.prototype.h01 = function(t) {
  return -2*Math.pow(t,3) + 3*Math.pow(t,2);
};

KeyframeAnimation.prototype.h11 = function(t) {
  return Math.pow(t, 3) - Math.pow(t, 2);
};
