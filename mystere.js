function loadText(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.overrideMimeType("text/plain");
  xhr.send(null);
  if (xhr.status === 200)
    return xhr.responseText;
  else {
    return null;
  }
}

var gl;
var program;
var attribPos;
var attribTexture;
var uSampler;

var bufferCube;
var bufferCubeText;
var textureCube

var bufferFloor;
var bufferFloorText;
var textureFloor;

var bufferTetra;
var bufferTetraText;
var textureTetra;

var tx = 0,
    ty = 0;

var uView, uPerspective, uModel;
var projMatrix = mat4.create();
var modelMatrix = mat4.create();
var viewMatrix = mat4.create();

var camera_y = 0;
var camera_x = 0;
var camera_z = -30;
var mouse_x = 0;
var mouse_y = 0;

function initShaders() {
  var vertSource = loadText('vertex.vert');
  var fragSource = loadText('fragment.frag');

  var vertex = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertex, vertSource);
  gl.compileShader(vertex);

  if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS))
    console.log("Erreur lors de la compilation du vertex shader:\n" + gl.getShaderInfoLog(vertex));

  var fragment = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragment, fragSource);
  gl.compileShader(fragment);

  if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS))
    console.log("Erreur lors de la compilation du fragment shader:\n" + gl.getShaderInfoLog(fragment));

  program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    console.log("Erreur lors du linkage du program:\n" + gl.getProgramInfoLog(program));

  gl.useProgram(program);

  attribPos = gl.getAttribLocation(program, "vertex_position");
  attribTexture = gl.getAttribLocation(program, "texture_coords");
  uPerspective = gl.getUniformLocation(program, 'PMatrix');
  uModel = gl.getUniformLocation(program, "MMatrix");
  uView = gl.getUniformLocation(program, "VMatrix");
  uSampler = gl.getUniformLocation(program, "sampler");
}

function initBuffers() {

  initCubeBuffer();
  initFloorBuffer();
  initTetraBuffer();

}

  /*******************
      CUBE
  *******************/

  function initCubeBuffer() {

    var coordsCube = [
      //face avant
      -1,1,1,  -1,-1,1,  1,1,1,  1,1,1,  -1,-1,1,  1,-1,1,
      //face arriere
      -1,1,-1,  -1,-1,-1,  1,1,-1,  1,1,-1,  -1,-1,-1,  1,-1,-1,
      //face gauche
      -1,1,-1,  -1,-1,-1,  -1,1,1,  -1,1,1,  -1,-1,-1,  -1,-1,1,
      //face droite
      1,1,-1,  1,-1,-1,  1,1,1,  1,1,1,  1,-1,-1,  1,-1,1,
      //face haut
      -1,1,-1,  -1,1,1,  1,1,-1,  1,1,-1, -1,1,1,  1,1,1,
      //face bas
      -1,-1,-1,  -1,-1,1,  1,-1,-1,  1,-1,-1,  -1,-1,1,  1,-1,1
    ];

    var coordsText = [
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0
    ];

    bufferCube = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCube);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordsCube), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    bufferCube.vertexSize = 3;
    bufferCube.numVertices = 36;

    var textureGrid = [];
    for (var j=0 ; j<6 ; j++) {
      textureGrid = textureGrid.concat(coordsText);
    }

    bufferCubeText = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferCubeText);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureGrid), gl.STATIC_DRAW);

    bufferCubeText.vertexSize = 2;
    bufferCubeText.numVertices = 6;

    textureCube = initTextures("wood03.jpg");

  }

  function initFloorBuffer() {

    var coordsFloor = [];
    var grid_size = 100;
    for(var x = -(grid_size/2); x<(grid_size/2); x++){
      for(var z = -(grid_size/2); z<(grid_size/2); z++){
        coordsFloor.push(  
          x,   0, z, 
          x+1, 0, z, 
          x,   0, z+1, 
          x,   0, z+1,
          x+1, 0, z,
          x+1, 0, z+1
        );
      }
    }
    
    var coordsText = [
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0
    ];

    bufferFloor = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferFloor);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordsFloor), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    bufferFloor.vertexSize = 3;
    bufferFloor.numVertices = grid_size*grid_size*6;

    var textureGrid = [];
    for (var j=0 ; j<(grid_size*grid_size) ; j++) {
      textureGrid = textureGrid.concat(coordsText);
    }

    bufferFloorText = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferFloorText);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureGrid), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    bufferFloorText.vertexSize = 2;
    bufferFloorText.numVertices = grid_size*grid_size;

    textureFloor = initTextures("tile11.jpg");

  }

  function initTetraBuffer() {

    var coordTetra = [
      0, 1, 0,  -1,-1, 1,  1,-1, 1,
      0, 1, 0,   1,-1, 1,  0,-1,-1,
      0, 1, 0,  -1,-1, 1,  0,-1,-1,
      0,-1,-1,  -1,-1, 1,  1,-1, 1
    ];

    var coordsText = [
      0.0, 0.0,
      1.0, 0.0,
      0.0, 1.0,
      0.0, 1.0,
      1.0, 0.0,
      1.0, 1.0
    ];

    bufferTetra = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferTetra);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordTetra), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    bufferTetra.vertexSize = 3;
    bufferTetra.numVertices = 12;

    var textureGrid = [];
    for (var j=0 ; j<6 ; j++) {
      textureGrid = textureGrid.concat(coordsText);
    }

    bufferTetraText = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferTetraText);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureGrid), gl.STATIC_DRAW);

    bufferTetraText.vertexSize = 2;
    bufferTetraText.numVertices = 6;

    textureTetra = initTextures("metal12.jpg");

  }

  function initTextures(name){

    var texture = gl.createTexture();
    var image = new Image()

    image.onload = function() {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.bindTexture(gl.TEXTURE_2D, null)
    };

    image.src = name;

    return texture;
  
  }

  

  var time = 0;

function drawCube() {

  mat4.identity(modelMatrix);
  mat4.rotateY(modelMatrix, modelMatrix, time);
  mat4.translate(modelMatrix, modelMatrix, [4, 1.5, -5]);
  mat4.scale(modelMatrix, modelMatrix, [1, 1.5, 1]);

  gl.uniformMatrix4fv(uModel, false, modelMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferCube);
  gl.vertexAttribPointer(attribPos, bufferCube.vertexSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribPos);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureCube);
  gl.uniform1i(uSampler, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferCubeText);
  gl.vertexAttribPointer(attribTexture, bufferCubeText.vertexSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  gl.drawArrays(gl.TRIANGLES, 0, bufferCube.numVertices);

}

function drawFloor() {

  mat4.identity(modelMatrix);

  gl.uniformMatrix4fv(uModel, false, modelMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferFloor);
  gl.vertexAttribPointer(attribPos, bufferFloor.vertexSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribPos);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureFloor);
  gl.uniform1i(uSampler, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferFloorText);
  gl.vertexAttribPointer(attribTexture, bufferFloorText.vertexSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  gl.drawArrays(gl.TRIANGLES, 0, bufferFloor.numVertices);

}

function drawTetra() {

  mat4.identity(modelMatrix);
  mat4.translate(modelMatrix, modelMatrix, [-3, 2, 4]);
  mat4.rotateY(modelMatrix, modelMatrix, time, [0, 0, 0]);

  gl.uniformMatrix4fv(uModel, false, modelMatrix);

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferTetra);
  gl.vertexAttribPointer(attribPos, bufferTetra.vertexSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribPos);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureTetra);
  gl.uniform1i(uSampler, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferTetraText);
  gl.vertexAttribPointer(attribTexture, bufferTetraText.vertexSize, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attribTexture);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

  gl.drawArrays(gl.TRIANGLES, 0, bufferTetra.numVertices);

}

function draw() {
  requestAnimationFrame(draw);

  gl.clearColor(0.0, 0.0, 1.0, 0.5);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.perspective(projMatrix, Math.PI / 4, 1, 0.1, 100);

  mat4.identity(viewMatrix);
  mat4.translate(viewMatrix, viewMatrix, [camera_x, camera_y, camera_z]);
  mat4.rotateX(viewMatrix, viewMatrix, -mouse_y);
  mat4.rotateY(viewMatrix, viewMatrix, mouse_x);

  gl.uniformMatrix4fv(uPerspective, false, projMatrix);
  gl.uniformMatrix4fv(uView, false, viewMatrix);

  drawCube();
  drawFloor();
  drawTetra();

  time += 0.01;
}

function main() {
  var canvas = document.getElementById('dawin-webgl');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl = canvas.getContext('webgl');
  if (!gl) {
    console.log('ERREUR : Echec du chargement du contexte !');
    return;
  }

  initShaders();
  initBuffers();

  draw();

  canvas.addEventListener("mousemove", function(e) {
    mouse_x = (e.pageX/canvas.width)*2.0 - 1.0;
    mouse_y = ((canvas.height-e.pageY)/canvas.height)*2.0 - 1.0;
  });

  canvas.addEventListener("DOMMouseScroll", function(e) {
    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    if (delta == -1) {
      camera_z += 0.5
    } else {
      camera_z -= 0.5
    }
  });

  document.onkeydown = function(e) {
            var k = e.keyCode;
            if(k == 37) // left
                camera_x += 0.1;
            if(k == 38) // up
                camera_y -= 0.1;
            if(k == 39) // right
                camera_x -= 0.1;
            if(k == 40) // down
                camera_y += 0.1;
            if(k == 65) // a
                camera_z += 0.2;
            if(k == 69) // e
                camera_z -= 0.2;
        };
}
