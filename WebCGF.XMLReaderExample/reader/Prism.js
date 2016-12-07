/**
 * Prism
 * @constructor
 */
 function Prism(scene) {
 	CGFobject.call(this,scene);

  this.quad= new Rectangle(scene, new Point3(-0.5,-0.5,0), new Point3(0.5,0.5,0));

 };

 Prism.prototype = Object.create(CGFobject.prototype);
 Prism.prototype.constructor = Prism;

 Prism.prototype.display = function() {
  this.scene.pushMatrix();

  this.scene.translate(0,0,0.5);//plano xy positivo
  this.quad.display();

	this.scene.translate(0,0,-1);//plano xy negativo
	this.scene.rotate(Math.PI,0,1,0);//(-x,y,-z)
	this.quad.display();

	this.scene.rotate(Math.PI/2,0,1,0);//plano yz  com x menor
	this.scene.translate(0.5,0,0.5);//(z,y,-x)
	this.quad.display();

	this.scene.translate(0,0,-1);//plano yz com x maior
	this.scene.rotate(Math.PI,0,1,0);//(-z,y,x)
	this.quad.display();

	this.scene.rotate(Math.PI/2,1,0,0);//plano xz negativo
	this.scene.translate(0,-0.5,0.5);//(-z,x,-y)
	this.quad.display();

	this.scene.rotate(Math.PI,1,0,0);//plano xz negativo
	this.scene.translate(0,0,1);//(-z,-x,y)
	this.quad.display();


  this.scene.popMatrix();

 };
