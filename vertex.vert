attribute vec3 vertex_position;
attribute vec2 texture_coords;

uniform mat4 perspective;
uniform mat4 transformation;

varying vec2 texcoords;
//varying vec3 vColor;

void main() {
    gl_Position = perspective * transformation * vec4(vertex_position,1.0);

    //vColor = vertex_position;
    texcoords = texture_coords;
}