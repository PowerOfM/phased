uniform vec3 vGravityPoint;

varying vec2 vUV;

void main () {
	// Transfer uv to frag shader
	vUV = uv;

	// Compute gl position
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}