/**
 * Vehicle
 * @constructor
 */
function Vehicle(scene) {
    CGFobject.call(this, scene);


      var controlPoints = [];
      var ang = Math.PI/16;
      for (var i = 0; i*ang <= 2*Math.PI; i++) {
        var theta = i * ang;
        var delta = 0.5;

        controlPoints.push( new Point3(Math.cos(theta), Math.sin(theta) * delta, 0) );
        delta++;
        controlPoints.push( new Point3(Math.cos(theta), Math.sin(theta) * delta, 2) );
        delta--;
        controlPoints.push( new Point3(Math.cos(theta), Math.sin(theta) * delta, 4) );
        delta--;
        controlPoints.push( new Point3(Math.cos(theta), Math.sin(theta) * delta, 6) );
      }


    /*
      var controlPoints = [];
      var ang = Math.PI/16;
      for (var i = 0; i*ang <= 2*Math.PI; i++) {
        var theta = i * ang;
        var delta = 0.5;

        controlPoints.push( new Point3(delta * Math.cos(theta), Math.sin(theta) * delta, 0) );

        delta++;
        controlPoints.push( new Point3(delta * Math.cos(theta), Math.sin(theta) * delta, 2) );
        controlPoints.push( new Point3(delta * Math.cos(theta), Math.sin(theta) * delta, 4) );

        delta--;
        controlPoints.push( new Point3(delta * Math.cos(theta), Math.sin(theta) * delta, 6) );
      }

      */


    this.tail = new Patch(scene, 32,3, 10, 10, controlPoints);
    this.body = new Cylinder(scene, 0.6, 1, 1, 10, 10);
    this.top= new Cylinder(scene, 1, 0.1, 1, 10, 10);
};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.display = function() {
  this.scene.pushMatrix();
  this.tail.display();
    /*this.scene.pushMatrix();
    this.scene.scale(1,1,3);
    this.body.display();
    this.scene.popMatrix();


    this.scene.pushMatrix();
    this.scene.translate(0,0,3);
    this.scene.scale(1,1,3);
    this.top.display();
    this.scene.popMatrix();*/

  this.scene.popMatrix();



};
