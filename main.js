
import * as THREE from 'https://unpkg.com/three@0.124.0/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

function vertexShaderFlow() {
  return `
uniform float time;
varying vec3 vColor;

// Perlin noise function
vec3 mod289(vec3 x) {
return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
return 1.79284291400159 - 0.85373472095314 * r;
}

float perlinNoise(vec3 v) {
const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

vec3 i = floor(v + dot(v, C.yyy));
vec3 x0 = v - i + dot(i, C.xxx);

vec3 g = step(x0.yzx, x0.xyz);
vec3 l = 1.0 - g;
vec3 i1 = min(g.xyz, l.zxy);
vec3 i2 = max(g.xyz, l.zxy);

vec3 x1 = x0 - i1 + C.xxx;
vec3 x2 = x0 - i2 + C.yyy;
vec3 x3 = x0 - D.yyy;

i = mod289(i);
vec4 p = permute(permute(permute(
i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
i.x + vec4(0.0, i1.x, i2.x, 1.0));

vec3 ns = 0.142857142857 * (D.wyz - D.xzx);

vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
vec4 x_ = floor(j * ns.z);
vec4 y_ = floor(j - 7.0 * x_);

vec4 x = x_ * ns.x + ns.yyyy;
vec4 y = y_ * ns.x + ns.yyyy;
vec4 h = 1.0 - abs(x) - abs(y);

vec4 b0 = vec4(x.xy, y.xy);
vec4 b1 = vec4(x.zw, y.zw);

vec4 s0 = floor(b0) * 2.0 + 1.0;
vec4 s1 = floor(b1) * 2.0 + 1.0;
vec4 sh = -step(h, vec4(0.0));

vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

vec3 p0 = vec3(a0.xy, h.x);
vec3 p1 = vec3(a0.zw, h.y);
vec3 p2 = vec3(a1.xy, h.z);
vec3 p3 = vec3(a1.zw, h.w);

vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
p0 *= norm.x;
p1 *= norm.y;
p2 *= norm.z;
p3 *= norm.w;

vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
m = m * m;
return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

void main() {
// Calculate noise-based effect
float noise = perlinNoise(vec3(position.xy * 0.1, time * 0.1));
// Create flow field pattern
float flow = sin(position.x * 10.0 + time * 0.5) * cos(position.y * 10.0 + time * 0.5);
// Combine noise and flow field
float illumination = noise * 0.5 + flow * 0.5;
vColor = vec3(illumination, illumination, illumination); // Set color based on illumination value
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
gl_PointSize = 1.0;
}
`
}

function vertexShaderPerlin() {
  return `
uniform float time;
varying vec3 vColor;

// Perlin noise function
vec3 mod289(vec3 x) {
return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
return 1.79284291400159 - 0.85373472095314 * r;
}

float perlinNoise(vec3 v) {
const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

vec3 i = floor(v + dot(v, C.yyy));
vec3 x0 = v - i + dot(i, C.xxx);

vec3 g = step(x0.yzx, x0.xyz);
vec3 l = 1.0 - g;
vec3 i1 = min(g.xyz, l.zxy);
vec3 i2 = max(g.xyz, l.zxy);

vec3 x1 = x0 - i1 + C.xxx;
vec3 x2 = x0 - i2 + C.yyy;
vec3 x3 = x0 - D.yyy;

i = mod289(i);
vec4 p = permute(permute(permute(
i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
i.x + vec4(0.0, i1.x, i2.x, 1.0));

vec3 ns = 0.142857142857 * (D.wyz - D.xzx);

vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
vec4 x_ = floor(j * ns.z);
vec4 y_ = floor(j - 7.0 * x_);

vec4 x = x_ * ns.x + ns.yyyy;
vec4 y = y_ * ns.x + ns.yyyy;
vec4 h = 1.0 - abs(x) - abs(y);

vec4 b0 = vec4(x.xy, y.xy);
vec4 b1 = vec4(x.zw, y.zw);

vec4 s0 = floor(b0) * 2.0 + 1.0;
vec4 s1 = floor(b1) * 2.0 + 1.0;
vec4 sh = -step(h, vec4(0.0));

vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

vec3 p0 = vec3(a0.xy, h.x);
vec3 p1 = vec3(a0.zw, h.y);
vec3 p2 = vec3(a1.xy, h.z);
vec3 p3 = vec3(a1.zw, h.w);

vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
p0 *= norm.x;
p1 *= norm.y;
p2 *= norm.z;
p3 *= norm.w;

vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
m = m * m;
return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

void main() {
// Calculate noise-based effect
float noise = perlinNoise(vec3(position.xy * 0.1, time * 0.1));
vColor = vec3(noise, noise, noise); // Set color based on noise value
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
gl_PointSize = 1.0;
}
`
}


function vertexShader() {
  return `
uniform float time;
varying vec3 vColor;

// Simplex noise function
vec3 mod289(vec3 x) {
return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r) {
return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
const vec2  C = vec2(1.0/6.0, 1.0/3.0);
const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

vec3 i  = floor(v + dot(v, C.yyy) );
vec3 x0 =   v - i + dot(i, C.xxx) ;

vec3 g = step(x0.yzx, x0.xyz);
vec3 l = 1.0 - g;
vec3 i1 = min( g.xyz, l.zxy );
vec3 i2 = max( g.xyz, l.zxy );

vec3 x1 = x0 - i1 + C.xxx;
vec3 x2 = x0 - i2 + C.yyy;
vec3 x3 = x0 - D.yyy;

i = mod289(i); 
vec4 p = permute( permute( permute( 
i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
+ i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
+ i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

vec3 ns = 0.142857142857 * (D.wyz - D.xzx);

vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
vec4 x_ = floor(j * ns.z);
vec4 y_ = floor(j - 7.0 * x_ );

vec4 x = x_ *ns.x + ns.yyyy;
vec4 y = y_ *ns.x + ns.yyyy;
vec4 h = 1.0 - abs(x) - abs(y);

vec4 b0 = vec4( x.xy, y.xy );
vec4 b1 = vec4( x.zw, y.zw );

vec4 s0 = floor(b0)*2.0 + 1.0;
vec4 s1 = floor(b1)*2.0 + 1.0;
vec4 sh = -step(h, vec4(0.0));

vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

vec3 p0 = vec3(a0.xy,h.x);
vec3 p1 = vec3(a0.zw,h.y);
vec3 p2 = vec3(a1.xy,h.z);
vec3 p3 = vec3(a1.zw,h.w);

vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
p0 *= norm.x;
p1 *= norm.y;
p2 *= norm.z;
p3 *= norm.w;

vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
m = m * m;
return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
dot(p2,x2), dot(p3,x3) ) );
}

void main() {
// Calculate noise-based wave effect
float noise = snoise(vec3(position.xy * 0.1, time));
float wave = sin(position.x * 10.0 + time) * 0.5 + 0.5 + noise * 0.5;
vColor = vec3(wave, wave, wave); // Set color based on wave value
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
gl_PointSize = 1.0;
}
`
}

function fragmentShader() {
  return `
varying vec3 vColor;

void main() {
gl_FragColor = vec4(vColor, 1.0); // Set fragment color
}
`
}

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.PlaneGeometry(20, 20, 400, 400);
// const material = new THREE.PointsMaterial( { color: 0x00ff00, size: 0.01 } );


const material = new THREE.ShaderMaterial({
  vertexShader: vertexShaderPerlin(),
  fragmentShader: fragmentShader(),
  uniforms: {
    time: { value: 0.0 }
  },
  vertexColors: true
});

const particles = new THREE.Points( geometry, material );
scene.add( particles );

camera.position.z = 5;

let time = 0.0;

function animate() {
  time += 0.01;
  material.uniforms.time.value = time;
  renderer.render( scene, camera );
}
