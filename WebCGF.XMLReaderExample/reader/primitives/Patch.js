/**
 * Patch
 * @constructor
 */
function Patch(scene, orderU, orderV, partsU, partsV, controlPoints) {
    var knots1 = this.getKnotsVector(orderU); // to be built inside webCGF in later versions ()
    var knots2 = this.getKnotsVector(orderV); // to be built inside webCGF in later versions


    var points = new Array(orderU+1);

    for (var j = 0; j <= orderU; j++) {
        var v = new Array(orderV+1);
        for (var i = 0; i <= orderV; i++) {
          var point=controlPoints[i + (orderV+1)*j]
          v[i] = [point.x,point.y,point.z,1];
        }
        points[j]=v;
    }
  

    var nurbsSurface = new CGFnurbsSurface(orderU, orderV, knots1, knots2, points);

    getSurfacePoint = function(u, v) {
      return nurbsSurface.getPoint(u, v);
    };

    CGFnurbsObject.call(this, scene, getSurfacePoint, partsU, partsV);
};


Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor = Patch;


Patch.prototype.getKnotsVector = function(degree) { // TODO (CGF 0.19.3): add to CGFnurbsSurface

	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}
