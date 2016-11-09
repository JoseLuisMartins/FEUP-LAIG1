function LinearAnimation(scene, id, controlPoints, span) {
  Animation.call(this, scene, id);

  this.controlPoints = controlPoints;
  this.span = span;

  this.distances = [];
  this.vectors = [];

  var distance = 0;
  for (var i = 0; i < controlPoints.length - 1; i++) {
    var vec = this.makeVector(controlPoints[i], controlPoints[i+1]);
    distance += this.calculateLength(vec);
    this.vectors.push(vec);
    this.distances.push(distance);
  }


  this.velocity = distance / span;
  this.currentControl = 0;
  this.theta = Math.atan(this.vectors[0].x / this.vectors[0].z);

  this.lastCurrTime = -1;
  this.distance = 0;
  this.timeElapsed = 0;
}


LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;


LinearAnimation.prototype.animate = function(currTime) {
  var delta;

  if (this.lastCurrTime == -1) {
      delta = 0;
  }
  else {
      delta = (currTime - this.lastCurrTime) / 1000;
  }

  this.lastCurrTime = currTime;
  this.timeElapsed += delta;


  this.distance += this.velocity * delta;
  if (this.distance > this.distances[this.currentControl]) {
    if (this.currentControl != this.vectors.length - 1) {
      this.currentControl++;
      this.theta = Math.atan(this.vectors[this.currentControl].x / this.vectors[this.currentControl].z);
    }
    else {
      return;
    }
  }


  var t = (this.timeElapsed * this.velocity) / this.calculateLength(this.vectors[this.currentControl]);
  var x = (this.controlPoints[this.currentControl + 1].x * t) + ((1 - t) * this.controlPoints[this.currentControl].x);
  var y = (this.controlPoints[this.currentControl + 1].y * t) + ((1 - t) * this.controlPoints[this.currentControl].y);
  var z = (this.controlPoints[this.currentControl + 1].z * t) + ((1 - t) * this.controlPoints[this.currentControl].z);

  console.log(this.timeElapsed, x + this.controlPoints[this.currentControl].x, y + this.controlPoints[this.currentControl].y, z + this.controlPoints[this.currentControl].z);

  this.scene.translate(x + this.controlPoints[this.currentControl].x,
                       y + this.controlPoints[this.currentControl].y,
                       z + this.controlPoints[this.currentControl].z);

  this.scene.rotate(this.theta, 0, 1, 0);
}


LinearAnimation.prototype.makeVector = function(point1, point2) {
    return new Point3(point2.x - point1.x, point2.y - point1.y, point2.z - point1.z)
}


LinearAnimation.prototype.calculateLength = function(vec) {
    return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y) + (vec.z * vec.z));
}
