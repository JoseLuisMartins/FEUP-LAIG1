var Point2 = function(x, y) {
	this.x = x;
	this.y = y;
}

var Point3 = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

var Point3W = function(x, y, z, w) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.w = w;
}

var ColorRGBA = function(r, g, b, a) {
	this.r = r;
	this.g = g;
	this.b = b;
  this.a = a;
}


var PerspectiveInfo = function(id, near, far, angle, from, to) {
	this.id = id;
	this.near = near;
	this.far = far;
	this.angle = angle;
	this.from = from;
	this.to = to;
}

class Illumination {
  constructor(doublesided, local, ambient, background) {
    this.doublesided = doublesided;
    this.local = local;
    this.ambient = ambient;
    this.background = background;
  }

}


class Light {
  constructor(id, enabled, ambient, diffuse, specular) {
    this.id = id;
    this.enabled = enabled;
    this.ambient = ambient;
    this.diffuse = diffuse;
    this.specular = specular;
  }
}

class Omni extends Light {
  constructor(light, location) {
    super(light.id, light.enabled, light.ambient, light.diffuse, light.specular);
    this.location = location;
  }

}

class Spot extends Light{
  constructor(light, angle, exponent, target, location) {
    super(light.id, light.enabled, light.ambient, light.diffuse, light.specular);
    this.angle = angle;
    this.exponent = exponent;
    this.location = location;
    this.direction = new Point3(target.x - location.x, target.y - location.y, target.z - location.z);
  }

}

class Texture {
  constructor(id, file, lengthS, lengthT) {
    this.id = id;
    this.file = file;
    this.lengthS = lengthS;
    this.lengthT = lengthT;
  }
}


class Material {
  constructor(id, emission, ambient, diffuse, specular, shininess) {
    this.id = id;
    this.emission = emission;
    this.ambient = ambient;
    this.diffuse = diffuse;
	this.specular = specular;
	this.shininess = shininess;
  }
}


class  Component{
  constructor(id,transformationId,materialIds,textureId,childrenIds) {
		this.id=id;
		this.transformationId=transformationId;
		this.materialIds=materialIds;
		this.textureId=textureId;
		this.childrenIds=childrenIds ;
  }
}


class Displayable {
	constructor(primitive, transformation, appearance) {
		this.primitive = primitive;
		this.transformation = transformation;
		this.appearance = appearance;
	}
}
