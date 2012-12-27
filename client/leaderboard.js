// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Template.leaderboard.players = function () {
    return Players.find({}, {sort:{score:-1, name:1}});
};

Template.leaderboard.selected_name = function () {
    var player = Players.findOne(Session.get("selected_player"));
    return player && player.name;
};

Template.player.selected = function () {
    return Session.equals("selected_player", this._id) ? "selected" : '';
};

Template.leaderboard.events({
    'click input.inc':function () {
        Players.update(Session.get("selected_player"), {$inc:{score:5}});
    }
});

Template.player.events({
    'click':function () {
        Session.set("selected_player", this._id);
        var player = Players.findOne(Session.get("selected_player"));
        var model = player.model;
        runWebGLApp(model);
    }
});

//WebGL parts
var gl = null; // WebGL context
var prg = null; // The program (shaders)
var c_width = 0; // Variable to store the width of the canvas
var c_height = 0; // Variable to store the height of the canvas

var coneVertexBuffer = null; //The vertex buffer for the cone
var coneIndexBuffer = null; // The index buffer for the cone

var indices = [];
var vertices = [];

var mvMatrix = mat4.create(); // The Model-View matrix
var pMatrix = mat4.create(); // The projection matrix

/**
 * The program contains a series of instructions that tell the Graphic Processing Unit (GPU)
 * what to do with every vertex and fragment that we pass it. (more about this on chapter 3)
 * The vertex shader and the fragment shader together are called the program.
 */
function initProgram() {
    var fgShader = utils.getShader(gl, 'shader-fs');
    var vxShader = utils.getShader(gl, 'shader-vs');

    prg = gl.createProgram();
    gl.attachShader(prg, vxShader);
    gl.attachShader(prg, fgShader);
    gl.linkProgram(prg);

    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        alert('Could not initialise shaders');
    }

    gl.useProgram(prg);

    prg.vertexPositionAttribute = gl.getAttribLocation(prg, 'aVertexPosition');
    prg.pMatrixUniform = gl.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixUniform = gl.getUniformLocation(prg, 'uMVMatrix');
}

/**
 * Creates the buffers that contain the geometry of the cone
 */


function initBuffers(geometry) {
    vertices = geometry.vertices;
    indices =geometry.indices;


    //The following code snippet creates a vertex buffer and binds data to it
    coneVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    coneIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coneIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

}

/**
 * Draws the scene
 */
function drawScene() {

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, c_width, c_height);

    mat4.perspective(45, c_width / c_height, 0.1, 10000.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, 0.0, -5.0]);

    gl.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, coneVertexBuffer);
    gl.vertexAttribPointer(prg.aVertexPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(prg.vertexPositionAttribute);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, coneIndexBuffer);
    gl.drawElements(gl.LINE_LOOP, indices.length, gl.UNSIGNED_SHORT, 0);
}

/**
 * Render Loop
 */
function renderLoop() {
    requestAnimFrame(renderLoop);
    drawScene();
}

/**
 * Executes the WebGL application
 * This function is invoked on the onLoad event of the web page.
 */
function runWebGLApp(model) {
    //Obtains a WebGL context
    gl = utils.getGLContext('canvas-element-id');
    //Initializes the program (shaders). More about this on chapter 3!
    initProgram();
    //Initializes the buffers that we are going to use to draw the cone (vertex buffer and index buffer)
    initBuffers(model);
    //Renders the scene!
    renderLoop();
}



