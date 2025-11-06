// main.js (Complete Working Code)

// === 1. THREE.js SETUP ===

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Light blue sky color

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10); // Move camera back and up
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// === LIGHTING ===
const ambientLight = new THREE.AmbientLight(0x404040, 5); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// === 2. CANNON-es PHYSICS SETUP ===

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0) // Standard Earth gravity (m/s^2)
});

let basketballMesh;
let basketballBody;

// --- MESH CREATION FUNCTIONS ---

function createCourt() {
    // THREE.js MESH
    const geometry = new THREE.PlaneGeometry(30, 50);
    const material = new THREE.MeshPhongMaterial({ color: 0xcd853f, side: THREE.DoubleSide });
    const court = new THREE.Mesh(geometry, material);
    
    court.rotation.x = Math.PI / 2;
    court.position.y = 0;
    scene.add(court);
    
    // CANNON.js BODY
    const courtShape = new CANNON.Plane();
    const courtBody = new CANNON.Body({ mass: 0, shape: courtShape });
    courtBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    world.addBody(courtBody);
}

function createBall() {
    // THREE.js MESH
    const radius = 0.5;
    const geometry = new THREE.SphereGeometry(radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: 0xff8c00 });
    const ball = new THREE.Mesh(geometry, material);
    ball.position.set(0, 5, 0);
    scene.add(ball);
    basketballMesh = ball;

    // CANNON.js BODY
    const ballShape = new CANNON.Sphere(radius);
    basketballBody = new CANNON.Body({ 
        mass: 5, 
        shape: ballShape, 
        position: new CANNON.Vec3(0, 5, 0) 
    });
    world.addBody(basketballBody);
}

// === 3. INITIALIZATION CALLS ===
createCourt();
createBall();


// --- 4. ANIMATION/RENDER LOOP ---
const timeStep = 1 / 60;

function animate() {
    requestAnimationFrame(animate); 
    
    // ADVANCE PHYSICS SIMULATION
    world.step(timeStep);

    // SYNCHRONIZE MESH WITH BODY
    if (basketballMesh && basketballBody) {
        basketballMesh.position.copy(basketballBody.position);
        basketballMesh.quaternion.copy(basketballBody.quaternion);
    }
    
    renderer.render(scene, camera);
}

// === 5. START & RESIZE ===
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// START THE GAME!
animate();
