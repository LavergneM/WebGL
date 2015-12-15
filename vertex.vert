attribute vec3 vertex_position;
attribute vec2 texture_coords;

uniform mat4 PMatrix;
uniform mat4 MMatrix;
uniform mat4 VMatrix;

varying vec2 texcoords;

void main() {
    gl_Position = PMatrix * VMatrix * MMatrix * vec4(vertex_position, 1.0);
    texcoords = texture_coords;
}
