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


class RectangleData {
  constructor(id,p1,p2) {
		this.id=id;
    this.p1=p1;
		this.p2=p2;
  }
}

class  TriangleData{
  constructor(id,p1,p2,p3) {
		this.id=id;
    this.p1=p1;
		this.p2=p2;
		this.p3=p3;
  }
}

class  CylinderData{
  constructor(id,base,top,height,slices,stacks) {
		this.id=id;
    this.base=base;
		this.top=top;
		this.height=height;
		this.slices=slices;
		this.stacks=stacks;
  }
}


class  SphereData{
  constructor(id,radius,slices,stacks) {
		this.id=id;
		this.radius=radius;
		this.slices=slices;
		this.stacks=stacks;
  }
}


class  TorusData{
  constructor(id,inner,outer,slices,loops) {
		this.id=id;
		this.inner=inner;
		this.outer=outer;
		this.slices=slices;
		this.loops=loops;
  }
}
