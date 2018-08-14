import vertexGlsl from './shaders/vertex.glsl'
import fragmentGlsl from './shaders/fragment.glsl'

// Init Canvas
const canvas = document.getElementById("canvas");
const w = window.innerWidth
const h = window.innerHeight
canvas.width = w
canvas.height = h

// Init WebGL

let gl = canvas.getContext('webgl');
if(!gl){
  console.log('WebGL not supported, falling back to experimental WebGL.')
  gl = canvas.getContext('experimental-webgl')
}
if(!gl) alert('Your browser does not support WebGL')

const R = 0.75
const G = 0.85
const B = 0.8
const A = 1.0
gl.clearColor(R, G, B, A)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

// Build shader program

function loadShader(type, glsl){
  let shader = gl.createShader(type)
  gl.shaderSource(shader, glsl)
  gl.compileShader(shader)
  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.error('ERROR compiling shader: ', gl.getShaderInfoLog(shader))
  return shader
}

let vertexShader = loadShader(gl.VERTEX_SHADER, vertexGlsl)
let fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentGlsl)

let program = gl.createProgram()
gl.attachShader(program, vertexShader)
gl.attachShader(program, fragmentShader)
gl.linkProgram(program)
if(!gl.getProgramParameter(program, gl.LINK_STATUS)) console.error('ERROR linking program: ', gl.getProgramInfoLog(program))

gl.validateProgram(program)
if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) console.error('ERROR validating program: ', gl.getProgramInfoLog(program))

// Create buffer

const vertices = [
  // X, Y,      R, G, B
   0.0,  0.5,   1.0, 1.0, 0.0,
  -0.5, -0.5,   0.7, 0.0, 1.0,
   0.5, -0.5,   0.1, 1.0, 0.6
]

const vboHandle = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, vboHandle)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

const positionAttribLocation = gl.getAttribLocation(program, 'vertexPosition')
gl.vertexAttribPointer(
  positionAttribLocation, 
  2, 
  gl.FLOAT, 
  gl.FALSE, // normalized
  5 * Float32Array.BYTES_PER_ELEMENT, // size of 1 vertex
  0 // offset from the beginning of a single vertex to this attribute
)
gl.enableVertexAttribArray(positionAttribLocation)

const colorAttribLocation = gl.getAttribLocation(program, 'vertexColor')
gl.vertexAttribPointer(
  colorAttribLocation, 
  3, 
  gl.FLOAT, 
  gl.FALSE, // normalized
  5 * Float32Array.BYTES_PER_ELEMENT, // size of 1 vertex
  2 * Float32Array.BYTES_PER_ELEMENT // offset from the beginning of a single vertex to this attribute
)
gl.enableVertexAttribArray(colorAttribLocation)

// DRAW
gl.useProgram(program)
gl.drawArrays(gl.TRIANGLES, 0, 3)