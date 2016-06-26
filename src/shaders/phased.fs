uniform float fTime;
uniform sampler2D tBase;

varying vec2 vUV;

// TODO: world-relative position from vertex-shader
vec2 center = vec2(0.5, 0.4);

// Original idea: https://www.shadertoy.com/view/ltlGDH
void main () {
	float time = fTime / 1.5;

	// Stop after 1.5s
	if (time > 1.5) {
		gl_FragColor = texture2D(tBase, vUV);

	} else {
		vec2 offset = vUV - center;
		float distort = 0.0;

		float radiusSqared = 1.5 * 1.5 * time;
		float lengthSquared = dot(offset, offset);

		if (lengthSquared >= radiusSqared) {
			float frequency = 5.0;
			float phase = (lengthSquared - radiusSqared) * frequency;
		    distort = sin(phase);// / frequency;
			
			// fade out completely at end
			distort = distort * (1.0 - time) * 0.5;
		}

	    // Direction from screen's center
	    vec2 direction = (normalize(-offset));
	    vec3 texel = texture2D(tBase, vUV - direction * distort).rgb + (vec3(0.0, 0.5, 1.0) * (distort));
		gl_FragColor = vec4(texel, 1.0);
	}
}