function LinearAnimation(id, controlPoints, span) {
  Animation.call(this, id);

  this.controlPoints = controlPoints;
  this.distances = [];

  var totalDistance = 0;
  for (var i = 0; i < controlPoints.length-1; i++) {
    var distance = this.distanceBetweenPoints(controlPoints[i], controlPoints[i+1]);
    totalDistance += distance;
    this.distances.push(distance);
  }

  this.velocity = totalDistance / span;
  this.distanceAcc = 0;

  this.currentControl = 0;
  this.currentPosition = new Point3(controlPoints[0].x, controlPoints[0].y, controlPoints[0].z);
  this.currentAngle = Math.atan2( (controlPoints[1].x - controlPoints[0].x), (controlPoints[1].z - controlPoints[0].z) );

  this.lastCurrTime = -1;
}


LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;


LinearAnimation.prototype.update = function(currTime) {
  var delta, x, y, z;

  if (!this.render)
    return;

  if (this.lastCurrTime == -1) {
    delta = 0;
  }
  else {
    delta = (currTime - this.lastCurrTime) / 1000;
  }
  this.lastCurrTime = currTime;


  this.distanceAcc += this.velocity * delta;
  if (this.distanceAcc > this.distances[this.currentControl]) {
    if (this.currentControl == this.controlPoints.length - 2) {
      this.finished = true;
      this.render = false;
      return;
    }
    else {
      this.distanceAcc = 0;
      this.currentControl++;
      this.currentAngle = Math.atan2( (this.controlPoints[this.currentControl + 1].x - this.controlPoints[this.currentControl].x),
                                      (this.controlPoints[this.currentControl + 1].z - this.controlPoints[this.currentControl].z) );
    }
  }


  t = this.distanceAcc / this.distances[this.currentControl];
  x = (this.controlPoints[this.currentControl + 1].x * t) + ((1 - t) * this.controlPoints[this.currentControl].x);
  y = (this.controlPoints[this.currentControl + 1].y * t) + ((1 - t) * this.controlPoints[this.currentControl].y);
  z = (this.controlPoints[this.currentControl + 1].z * t) + ((1 - t) * this.controlPoints[this.currentControl].z);

  this.currentPosition.set(x, y, z);
}



LinearAnimation.prototype.getCurrentPosition = function() {

  return this.currentPosition;
}


LinearAnimation.prototype.getCurrentAngle = function() {

  return this.currentAngle;
};


LinearAnimation.prototype.distanceBetweenPoints = function(point1, point2) {
  var dx = point2.x - point1.x;
  var dy = point2.y - point1.y;
  var dz = point2.z - point1.z;

  return Math.sqrt(dx*dx + dy*dy + dz*dz);
};
