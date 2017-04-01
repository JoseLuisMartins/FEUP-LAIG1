/**
 * Plane
 * @constructor
 */
function Plane(scene, dimX, dimY, partsX, partsY) {
  var knots1 = this.getKnotsVector(1); // to be built inside webCGF in later versions ()
  var knots2 = this.getKnotsVector(1); // to be built inside webCGF in later versions

  var controlPoints=[	// U = 0
          						[ // V = 0..1;
          							 [-dimX/2, -dimY/2, 0.0, 1 ],
          							 [-dimX/2,  dimY/2, 0.0, 1 ]

          						],
          						// U = 1
          						[ // V = 0..1
                        [dimX/2, -dimY/2, 0.0, 1 ],
                        [dimX/2, dimY/2, 0.0, 1 ]
          						]
          					];

  var nurbsSurface = new CGFnurbsSurface(1, 1, knots1, knots2, controlPoints);

  getSurfacePoint = function(u, v) {
    return nurbsSurface.getPoint(u, v);
  };

  CGFnurbsObject.call(this, scene, getSurfacePoint, partsX, partsY);

};

Plane.prototype = Object.create(CGFnurbsObject.prototype);
Plane.prototype.constructor = Plane;


Plane.prototype.getKnotsVector = function(degree) { // TODO (CGF 0.19.3): add to CGFnurbsSurface

	var v = new Array();
	for (var i=0; i<=degree; i++) {
		v.push(0);
	}
	for (var i=0; i<=degree; i++) {
		v.push(1);
	}
	return v;
}
