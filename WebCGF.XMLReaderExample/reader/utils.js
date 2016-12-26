class Point2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}


class Point3 {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	toArray() {
		return [this.x, this.y, this.z];
	}

	set(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
}


class Point3W {
	constructor(x, y, z, w) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;
	}
}


class ColorRGBA {
	constructor(r, g, b, a) {
		this.r = r;
		this.g = g;
		this.b = b;
	  this.a = a;
	}
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
  constructor(id, texture, lengthS, lengthT) {
    this.id = id;
    this.texture = texture;
    this.lengthS = lengthS;
    this.lengthT = lengthT;
  }
}


class  Component {
  constructor(id, transformationID, materialIDs, textureID, componentIds, primitiveIds, animated) {
		this.id = id;
		this.transformationID = transformationID;
		this.materialIDs = materialIDs;
		this.textureID = textureID;
		this.componentIds = componentIds;
		this.primitiveIds = primitiveIds;
		this.animated = animated;
  }
}


class  CircularAnimationInfo {
  constructor(id, center, radius, phiDeg, thetaDeg, span) {
		this.id = id;
		this.center=center;
		this.radius=radius;
		this.phiDeg=phiDeg;
		this.thetaDeg=thetaDeg;
		this.span=span;
  }
}

class  LinearAnimationInfo {
  constructor(id, controlPoints, span) {
		this.id = id;
		this.controlPoints= controlPoints;
		this.span=span;
  }
}

class Play{
	constructor(id) {
		this.id=id;
		this.start1=null;
		this.end1=null;
		this.pawn=null;
		this.start2=null;
		this.end2=null;
		this.wallCoords=null;
		this.wallOrientation=null;
  }

	setPlayerData1(start1,end1,pawn){
		this.start1=start1;
		this.end1=end1;
		this.pawn=pawn;
	}

	setPlayerData2(start2,end2){
		this.start2=start2;
		this.end2=end2;
	}

	setWallData(wallCoords,wallOrientation){
		this.wallCoords=wallCoords;
		this.wallOrientation=wallOrientation;
	}

	resetMove1(){
		this.start1=null;
		this.end1=null;
	}

	resetMove2(){
		this.start2=null;
		this.end2=null;
	}
	resetWall(){
		this.wallCoords=null;
		this.wallOrientation=null;
	}
}
