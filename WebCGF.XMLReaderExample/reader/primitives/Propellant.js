/**
 * Propellant
 * @constructor
 */
function Propellant(scene) {

  this.scene=scene;


  var controlPoints= [
    new Point3(-0.048,	-0.491,	-0.000),
    new Point3(-0.048,	-0.491,	-0.000),
    new Point3(-0.048,	-0.491,	0.000),
    new Point3(  -0.048,	-0.491,	-0.000),
    new Point3(  -0.048,	-0.491,	-0.000),
    new Point3(  -0.048,	-0.491,	-0.000),

    new Point3(  0.000,	-1.000,	0.400),
    new Point3(  -1.000,	-1.000,	0.400),
    new Point3(  -1.000,	1.000,	0.400),
    new Point3(  1.000,	1.000, 0.400),
    new Point3(  1.000,	-1.000,	0.400),
    new Point3(  0.000,	-1.000,	0.400),

    new Point3(  0.000,	-1.000,	0.800),
    new Point3(  -1.000,	-1.000,	0.800),
    new Point3(  -1.000,	1.000,	0.800),
    new Point3(  1.000,	1.000,	0.800),
    new Point3(  1.000,	-1.000,	0.800),
    new Point3(  0.000,	-1.000,	0.800),

    new Point3(  0.000,	-1.000,	1.200),
    new Point3(  -1.000,	-1.000,	1.200),
    new Point3(  -1.000,	1.000,	1.200),
    new Point3(  1.000,	1.000,	1.200),
    new Point3(  1.000,	-1.000,	1.200),
    new Point3(  0.000,	-1.000,	1.200),

    new Point3(  0.000,	-1.000,	1.600),
    new Point3(  -1.000,	-1.000,	1.600),
    new Point3(  -1.000,	1.000,	1.600),
    new Point3(  1.000,	1.000,	1.600),
    new Point3(  1.000,	-1.000,	1.600),
    new Point3(  0.000,	-1.000,	1.600),

    new Point3(  0.000,	-1.000,	2.000),
    new Point3(  -1.000,	-1.000,	2.000),
    new Point3(  -1.000,	1.000,	2.000),
    new Point3(  1.000,	1.000,	2.000),
    new Point3(  1.000,	-1.000,	2.000),
    new Point3(  0.000,	-1.000,	2.000)

  ];
  this.prop = new Patch(scene, 5, 5, 10, 10, controlPoints);
  this.shader = new CGFshader(scene.gl, "shaders\\propellant.vert", "shaders\\propellant.frag");

  this.texture = new CGFtexture(this.scene, "resources\\images\\flame.jpg");

  this.values = [0.0,0.15,0.30,0.54,0.70,0.90,1.10,1.35,1.10,0.90,0.70,0.54,0.30,0.15,0.0];
  this.index = 0;
};

Propellant.prototype = Object.create(CGFobject.prototype);
Propellant.prototype.constructor = Propellant;

Propellant.prototype.display = function() {

  this.scene.pushMatrix();

  this.texture.bind(0);
  this.scene.setActiveShader(this.shader);
  this.prop.display();
  this.scene.setActiveShader(this.scene.defaultShader);

  this.scene.popMatrix();

};

Propellant.prototype.update = function(currTime) {

  this.shader.setUniformsValues({t : this.values[this.index % this.values.length]});
  this.index++;
}
