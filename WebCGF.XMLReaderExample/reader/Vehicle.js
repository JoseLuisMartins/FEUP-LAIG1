/**
 * Vehicle
 * @constructor
 */
function Vehicle(scene) {
    CGFobject.call(this, scene);

    /*
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
    */


    // Define body's control points
    var controlPoints = [];
    var ang = Math.PI/16;
    for (var i = 0; i*ang <= 2*Math.PI; i++) {
      var theta = i * ang;
      var delta = 0.5;

      controlPoints.push( new Point3(delta * Math.cos(theta), Math.sin(theta) * delta, 0) );

      delta = 1.4;
      controlPoints.push( new Point3(delta * Math.cos(theta), Math.sin(theta) * delta, 2) );
      controlPoints.push( new Point3(delta * Math.cos(theta), Math.sin(theta) * delta, 4) );

      delta = 0.5;
      controlPoints.push( new Point3(delta * Math.cos(theta), Math.sin(theta) * delta, 6) );
    }


    this.body = new Patch(scene, 32, 3, 10, 10, controlPoints);
    this.bodyAppearance = new CGFappearance(this.scene);
    this.bodyAppearance.loadTexture("resources\\images\\rocket_body.jpg");


    this.top = new Cylinder(scene, 0.45, 0, 1, 20, 20);
    this.orangeAppearance = new CGFappearance(this.scene);
    this.orangeAppearance.loadTexture("resources\\images\\rocket_top.jpg");

    this.fins = [
                  new Triangle(scene, new Point3(0, -2, 0), new Point3(0, 2, 0), new Point3(0, 0, 3)),
                  new Triangle(scene, new Point3(0, 2, 0), new Point3(0, -2, 0), new Point3(0, 0, 3)),
                  new Triangle(scene, new Point3(-2, 0, 0), new Point3(2, 0, 0), new Point3(0, 0, 3)),
                  new Triangle(scene, new Point3(2, 0, 0), new Point3(-2, 0, 0), new Point3(0, 0, 3))
                ];


    this.windowFrame = new Torus(scene, 0.2, 0.3, 20, 20);

    this.windowImage = new Rectangle(scene, new Point2(-0.2, -0.2), new Point2(0.2, 0.2));
    this.windowImageAppearance = new CGFappearance(scene);
    this.windowImageAppearance.loadTexture("resources\\images\\prof_aas.jpg");

    this.tube = new Cylinder(scene, 0.5, 0.5, 0, 20, 20);
};

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.display = function() {

  /****************************/
  this.bodyAppearance.apply();


  this.scene.pushMatrix();
    this.body.display();
  this.scene.popMatrix();
  /****************************/


  /****************************/
  this.windowImageAppearance.apply();

  this.scene.pushMatrix();
    this.scene.translate(0, 1.01, 3);
    this.scene.rotate(-Math.PI/2, 1, 0, 0);
    this.scene.rotate(Math.PI, 0, 0, 1);
    this.windowImage.display();
  this.scene.popMatrix();
  /****************************/


  /****************************/
  this.orangeAppearance.apply();

  this.scene.pushMatrix();
    this.scene.translate(0, 0, 6);
    this.top.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    for (var fin of this.fins) {
      fin.display();
    }
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.scene.translate(0, 1, 3);
    this.scene.rotate(Math.PI/2, 1, 0, 0);
    this.windowFrame.display();
  this.scene.popMatrix();

  this.scene.pushMatrix();
    this.tube.display();
  this.scene.popMatrix();
  /****************************/
};
