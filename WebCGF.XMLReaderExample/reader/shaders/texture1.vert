#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
uniform float sU;
uniform float sV;

varying vec2 vTextureCoord;


void main() {

		if(((aTextureCoord.x >= (sU/10.0)) && ((aTextureCoord.x <= (sU+1.0)/10.0))) && ((aTextureCoord.y >= (sV/10.0)) && (aTextureCoord.y <= (sV+1.0)/10.0)) )
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x ,aVertexPosition.y ,aVertexPosition.z + 0.15, 1.0);
	else
			gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

  vTextureCoord = aTextureCoord;
}
