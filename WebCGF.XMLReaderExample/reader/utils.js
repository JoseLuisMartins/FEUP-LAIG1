var Point = function(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

var PointW = function(x, y, z, w) {
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
    this.direction = new Point(target.x - location.x, target.y - location.y, target.z - location.z);
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
