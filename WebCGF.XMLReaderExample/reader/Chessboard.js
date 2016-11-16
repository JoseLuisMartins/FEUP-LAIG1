
/**
 * Chessboard
 * @constructor
 */
function Chessboard(scene,du,dv,textureref,su,sv,c1,c2,cs) {
    CGFobject.call(this, scene);
    this.scene=scene;

    this.shader = new CGFshader(scene.gl, "shaders\\texture1.vert", "shaders\\texture1.frag");
    this.plane = new Plane(this.scene, 1, 1, du*10, dv*10);

    console.log("Tecture " + textureref);
    this.texture = this.scene.graph.textures[textureref];

    this.shader.setUniformsValues({uSampler : 0,
                                  color1 : [c1.r, c1.g, c1.b, c1.a],
                                  color2 : [c2.r, c2.g, c2.b, c2.a],
                                  colorMark : [cs.r, cs.g, cs.b, cs.a],
                                  divU:parseInt(du)*1.0,divV:parseInt(dv)*1.0,
                                  sU:parseInt(su)*1.0,sV:parseInt(sv)*1.0});

};

Chessboard.prototype = Object.create(CGFobject.prototype);
Chessboard.prototype.constructor = Chessboard;

Chessboard.prototype.display = function() {

    this.texture.bind(0);

    this.scene.setActiveShader(this.shader);
    this.plane.display();
    this.scene.setActiveShader(this.scene.defaultShader);

};
