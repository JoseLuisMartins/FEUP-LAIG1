/**
 * MyInterface
 * @constructor
 */


function MyInterface() {
	//call CGFinterface constructor
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {

	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();
  this.omni=this.gui.addFolder("Omni Lights");
  this.omni.open();
  this.spot=this.gui.addFolder("Spot Lights");
  this.spot.open();

  return true;
};

MyInterface.prototype.addLight = function(type,i,name) {
    if(type == "omni")
      this.omni.add(this.scene.lightsStatus,i,this.scene.lightsStatus[i]).name(name);
    else
      this.spot.add(this.scene.lightsStatus,i,this.scene.lightsStatus[i]).name(name);

}


MyInterface.prototype.processKeyDown = function(event) {
	//CGFinterface.prototype.processKeyDown.call(this,event);

	switch (event.keyCode)
	{
	};
};

MyInterface.prototype.processKeyUp = function(event) {
	//CGFinterface.prototype.processKeyUp.call(this,event);

	switch (event.keyCode)
	{
	};
};
