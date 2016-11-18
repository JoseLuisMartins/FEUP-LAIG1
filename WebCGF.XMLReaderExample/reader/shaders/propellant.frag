#ifdef GL_ES
precision highp float;
#endif


varying vec2 vTextureCoord;
uniform sampler2D uSampler;



void main() {

  vec4 finalColor = texture2D(uSampler, vTextureCoord);

  gl_FragColor = finalColor;
}
