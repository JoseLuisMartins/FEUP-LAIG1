#ifdef GL_ES
precision highp float;
#endif


void main(){

		if ( (gl_FragCoord.x > 600.0 && gl_FragCoord.y > 450.0) ||
				 (gl_FragCoord.x < 600.0 && gl_FragCoord.y < 450.0) ) {
			gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
		}
		else {
			gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
		}
}
