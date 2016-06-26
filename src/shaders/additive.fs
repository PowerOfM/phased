uniform sampler2D tBase;
uniform sampler2D tAdd;
uniform float fAmount;

varying vec2 vUV;

void main () {
	// Get pixels from each texture
	vec4 texelBase = texture2D(tBase, vUV);
	vec4 texelAdd = texture2D(tAdd, vUV);

	// Combine using fAmount multiplier
	gl_FragColor = texelBase + (texelAdd * fAmount);
}