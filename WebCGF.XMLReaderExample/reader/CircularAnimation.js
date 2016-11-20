// phiDeg = initial angle
// thetaDeg = angle to rotate
function CircularAnimation(id, center, radius, phiDeg, thetaDeg, span) {
  Animation.call(this, id);

  this.center = center;
  this.radius = radius;
  this.phi = phiDeg * (Math.PI / 180.0) + Math.PI/2;
  this.theta = thetaDeg * (Math.PI / 180.0);

  this.W = this.theta / span;
  this.currentPosition = new Point3(this.center.x + this.radius * Math.sin(this.phi),
                                    this.center.y,
                                    this.center.z + this.radius * Math.cos(this.phi));

  this.currentAngle = this.phi;

  if(this.theta < 0)
    this.rot = -Math.PI/2;
    else
    this.rot = Math.PI/2;

  this.span = span;
  this.timeElapsed = 0;
  this.lastCurrTime = -1;
}


CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;



CircularAnimation.prototype.update = function(currTime) {
  var x, y, z;

  if (!this.render)
    return;

  if (this.timeElapsed >= this.span) {
    x = this.center.x + this.radius * Math.sin(this.theta + this.phi);
    y = this.center.y;
    z = this.center.z + this.radius * Math.cos(this.theta + this.phi);
    this.finished = true;
    this.render= false;
    return;
  }


  if (this.lastCurrTime != -1) {
    this.timeElapsed += (currTime - this.lastCurrTime) / 1000;
  }
  this.lastCurrTime = currTime;

  this.currentAngle = this.W * this.timeElapsed + this.phi;
  x = this.center.x + this.radius * Math.sin(this.currentAngle);
  y = this.center.y;
  z = this.center.z + this.radius * Math.cos(this.currentAngle);

  this.currentAngle += this.rot;


  this.currentPosition.set(x, y, z);
}


CircularAnimation.prototype.getCurrentPosition = function() {

  return this.currentPosition;
}


CircularAnimation.prototype.getCurrentAngle = function() {

  return this.currentAngle;
};
