precision mediump float;

//varying vec3 vColor;

uniform sampler2D sampler;
varying vec2 texcoords;

void main() {
    //gl_FragColor = vec4(vColor,1.0);
    gl_FragColor = texture2D(sampler, texcoords);
}