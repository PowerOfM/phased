#define TAU 6.28318530718

uniform float fTime;
uniform float fCount;
uniform vec3 vIntensityColour; // orange: vec3(1.0, 0.5, 0.1)
uniform vec3 vBaseColour; // red: vec3(0.6, 0.0, 0.05)
uniform vec3 vColour; // red: vec3(1.0, 0.0, 0.0)

varying vec2 vUV;

// Source: https://www.shadertoy.com/view/MdlXz8
vec3 fabricWarp (float time) {    
    // Position and intensity
    vec2 p = mod(vUV * TAU * fCount, TAU) - 250.0;
	vec2 i = vec2(p);

	// Colour multiplier
	float c = 1.0;
	float inten = .005;

	// Loop for 5 iterations
	for (int n = 0; n < 5; n++) {
		// Displace the pixel's position in a distorted circular motion according to time
		float t = time * (1.0 - (3.5 / float(n+1)));
		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
	}

	c /= float(5);
	c = 1.17-pow(c, 1.4);
	c = pow(abs(c), 8.0);

	// Compute highlight colour
	vec3 colour = vIntensityColour * c;

	// Add to base colour
    colour = clamp(colour + vBaseColour, 0.0, 1.0);

    return colour;
}

// Source: http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

void main () {
	// Scale time by half
	float time = fTime * 0.5;

	// Scanline effect
	float m = (sin(time + (vUV.x - vUV.y) * 100.0) + cos(time + (vUV.y) * 5000.0));
    vec3 scanlines = m * vColour;

    // Wavy fabric effect
    vec3 fabric = fabricWarp(time);
    
    // Multiply together, clamped to valid colour range
    vec3 result = clamp(scanlines * fabric * rand(vUV), 0.0, 1.0);
	gl_FragColor = vec4(result, 1.0);
}