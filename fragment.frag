precision mediump float;

uniform sampler2D sampler;
varying vec2 texcoords;

void main() {
    gl_FragColor = texture2D(sampler, texcoords);
}
