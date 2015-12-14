
    function loadText(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.overrideMimeType("text/plain");
        xhr.send(null);
        if(xhr.status === 200)
            return xhr.responseText;
        else {
            return null;
        }
    }

    var gl;
    var program;
    var attribPos;
    var buffer;

    var floorBuffer;
    var floorBufferText;

    var bufferTetra;
    var bufferTextTetra;

    var uPerspective;
    var matrice1;

    var uMatrice;
    var matrice2;
    var time = 1;

    var textureCube;
    var textureFloor;
    var textureTetra;
    var bufferText;
    var attribTexture;

    var uSampler;

    //Variable pour la caméra
    var viewMatrix = mat4.create();
    var xCamera = 8, yCamera = 5, zCamera= 18;

    function initShaders() {
        var vertSource = loadText('vertex.vert');
        var fragSource = loadText('fragment.frag');

        var vertex = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertex, vertSource);
        gl.compileShader(vertex);

        if(!gl.getShaderParameter(vertex, gl.COMPILE_STATUS))
            console.log("Erreur lors de la compilation du vertex shader:\n"+gl.getShaderInfoLog(vertex));

        var fragment = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragment, fragSource);
        gl.compileShader(fragment);

        if(!gl.getShaderParameter(fragment, gl.COMPILE_STATUS))
            console.log("Erreur lors de la compilation du fragment shader:\n"+gl.getShaderInfoLog(fragment));

        program = gl.createProgram();
        gl.attachShader(program, vertex);
        gl.attachShader(program, fragment);
        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS))
            console.log("Erreur lors du linkage du program:\n"+gl.getProgramInfoLog(program));

        gl.useProgram(program);

        attribPos = gl.getAttribLocation(program, "vertex_position");
        attribTexture = gl.getAttribLocation(program, "texture_coords");
        uPerspective = gl.getUniformLocation(program, "perspective");
        uMatrice = gl.getUniformLocation(program, "transformation");
        uSampler = gl.getUniformLocation(program, "sampler");
    }

    function initBuffers() {

        initBufferCube();
        initBufferFloor();
        initBufferTetra();
    }

    function initBufferFloor(){
        var coordFloor = [];
        var grid_size = 10;
        var count = 0;
        for(var x = -50; x<50; x++){
            for(var z = -50; z<50; z++){
                count++;
                coordFloor.push( x,   0, z, 
                                 x+1, 0, z, 
                                 x,   0, z+1, 
                                 x,   0, z+1,
                                 x+1, 0, z,
                                 x+1, 0, z+1);
            }
        }
        console.log(coordFloor);
                var coordText = [0.0, 0.0,
                         1.0,0.0,
                         0.0,1.0,
                         0.0,1.0,
                         1.0,0.0,
                         1.0,1.0];

        floorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, floorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordFloor), gl.STATIC_DRAW);

        console.log(count);

        floorBuffer.vertexSize = 3;
        floorBuffer.numVertices = 60000;

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        var textureGrid = [];

        for (var j=0 ; j<10000 ; j++) {
            textureGrid = textureGrid.concat(coordText);
        }

        floorBufferText = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, floorBufferText);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureGrid), gl.STATIC_DRAW);

        floorBufferText.vertexSize = 2;
        floorBufferText.numVertices = 10000;

        textureFloor = initTextures("tile11.jpg");
    }

    function initBufferCube(){
        var coordCube = [
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


        var coordText = [0.0, 0.0,
                         1.0,0.0,
                         0.0,1.0,
                         0.0,1.0,
                         1.0,0.0,
                         1.0,1.0];

        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordCube), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        buffer.vertexSize = 3;
        buffer.numVertices = 36;

        var textureGrid = [];

        for (var j=0 ; j<6 ; j++) {
            textureGrid = textureGrid.concat(coordText);
        }

        bufferText = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferText);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureGrid), gl.STATIC_DRAW);

        bufferText.vertexSize = 2;
        bufferText.numVertices = 6;

        textureCube = initTextures("wood03.jpg");
    }

    function initBufferTetra(){
        var coordTetra = [
            //face avant
            0,1,0,  -1,-1,1,  1,-1,1,
            //face arriere
            0,1,0,  1,-1,1,  0,-1,-1,
            //face gauche
            0,1,0,  -1,-1,1,  0,-1,-1,
            //face droite
            0,-1,-1,  -1,-1,1,  1,-1,1
        ];


        var coordText = [0.0, 0.0,
                         1.0,0.0,
                         0.0,1.0,
                         0.0,1.0,
                         1.0,0.0,
                         1.0,1.0];

        bufferTetra = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferTetra);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coordTetra), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        bufferTetra.vertexSize = 3;
        bufferTetra.numVertices = 12;

        var textureGrid = [];

        for (var j=0 ; j<6 ; j++) {
            textureGrid = textureGrid.concat(coordText);
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

    function drawCube() {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(attribPos, buffer.vertexSize, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribPos);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureCube);
        gl.uniform1i(uSampler, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, bufferText);
        gl.vertexAttribPointer(attribTexture, bufferText.vertexSize, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.drawArrays(gl.TRIANGLES, 0, buffer.numVertices);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    function drawTetra() {
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

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    function drawFloor() {
        gl.bindBuffer(gl.ARRAY_BUFFER, floorBuffer);
        gl.vertexAttribPointer(attribPos, floorBuffer.vertexSize, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribPos);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textureFloor);
        gl.uniform1i(uSampler, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, floorBufferText);
        gl.vertexAttribPointer(attribTexture, floorBufferText.vertexSize, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attribTexture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        gl.drawArrays(gl.TRIANGLES, 0, floorBuffer.numVertices);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    function draw() {
        requestAnimationFrame(function(e){
            time += 0.005;
            matrice1 = mat4.create();
            mat4.perspective(matrice1, Math.PI/4, 1, 0.1, 100);
            gl.uniformMatrix4fv(uPerspective, false, matrice1);

            var vecteurTranslation = [0,-5,-18];

            matrice2 = mat4.create();
            mat4.translate(matrice2,matrice2,vecteurTranslation);
            mat4.rotateY(matrice2,matrice2,Math.PI*time);
            gl.uniformMatrix4fv(uMatrice, false, matrice2);
            draw();
        });

        gl.clearColor(0.0,0.0,1.0,0.5);
        gl.enable(gl.DEPTH_TEST);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //drawCube();
        drawFloor();
        drawTetra();
    }

    function main() {
        var canvas = document.getElementById('dawin-webgl');
        gl = canvas.getContext('webgl');
        if (!gl) {
            console.log('ERREUR : Echec du chargement du contexte !');
            return;
        }

        initShaders();
        initBuffers();
        
        draw();
    }
