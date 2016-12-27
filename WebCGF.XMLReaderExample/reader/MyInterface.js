/**
 * MyInterface
 * @constructor
 */


function MyInterface() {
    //call CGFinterface constructor
    CGFinterface.call(this);
}

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;


MyInterface.prototype.init = function(application) {

    CGFinterface.prototype.init.call(this, application);
    return true;
};

MyInterface.prototype.addLight = function(type, i, name) {};


MyInterface.prototype.processKeyDown = function(event) {

    switch (event.keyCode) {
        case (86):
        case (118): //V
            this.scene.updateView();
            break;
        case (77):
        case (109): //M
            this.scene.updateMaterial();
            break;
        case (90):
        case (122): //z
            this.scene.blockade.undo();
            break;
    }
};



MyInterface.prototype.reset = function() {
    this.omni.close();
    this.omni.open();

    this.spot.close();
    this.spot.open();
};