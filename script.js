// Three.js Scene Setup
let scene, camera, renderer, controls;
let textMesh, islandGroup, oceanMesh;
let palmTree, textShadow;
let animationId;

// Initialize the scene
function init() {
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x87CEEB, 50, 200);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 15, 25);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x87CEEB);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('container').appendChild(renderer.domElement);

    // Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 100;

    // Lighting
    setupLighting();

    // Create scene elements
    createOcean();
    createIsland();
    createPalmTree();
    createText();
    
    // Hide loading
    document.getElementById('loading').style.display = 'none';

    // Start animation
    animate();
}

function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(20, 30, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);
}

function createOcean() {
    const oceanGeometry = new THREE.PlaneGeometry(200, 200, 100, 100);
    const oceanMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            color1: { value: new THREE.Color(0x006994) },
            color2: { value: new THREE.Color(0x87CEEB) }
        },
        vertexShader: `
            uniform float time;
            varying vec2 vUv;
            varying float vWave;
            
            void main() {
                vUv = uv;
                vec3 pos = position;
                
                float wave1 = sin(pos.x * 0.05 + time * 2.0) * 2.0;
                float wave2 = sin(pos.y * 0.08 + time * 1.5) * 1.5;
                float wave3 = sin((pos.x + pos.y) * 0.03 + time * 3.0) * 1.0;
                
                vWave = (wave1 + wave2 + wave3) * 0.3;
                pos.z = vWave;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            varying float vWave;
            
            void main() {
                float mixStrength = (vWave + 2.0) * 0.25;
                vec3 color = mix(color1, color2, mixStrength);
                gl_FragColor = vec4(color, 0.8);
            }
        `,
        transparent: true
    });

    oceanMesh = new THREE.Mesh(oceanGeometry, oceanMaterial);
    oceanMesh.rotation.x = -Math.PI / 2;
    oceanMesh.position.y = -2;
    scene.add(oceanMesh);
}

function createIsland() {
    islandGroup = new THREE.Group();

    // Island base (sand)
    const islandGeometry = new THREE.CylinderGeometry(8, 10, 2, 16);
    const islandMaterial = new THREE.MeshLambertMaterial({ color: 0xF4E4BC });
    const island = new THREE.Mesh(islandGeometry, islandMaterial);
    island.position.y = -1;
    island.receiveShadow = true;
    islandGroup.add(island);

    // Rocks around island
    for (let i = 0; i < 8; i++) {
        const rockGeometry = new THREE.SphereGeometry(Math.random() * 0.5 + 0.3, 8, 6);
        const rockMaterial = new THREE.MeshLambertMaterial({ color: 0x8B7D6B });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        
        const angle = (i / 8) * Math.PI * 2;
        rock.position.x = Math.cos(angle) * (8 + Math.random() * 2);
        rock.position.z = Math.sin(angle) * (8 + Math.random() * 2);
        rock.position.y = -1.5 + Math.random() * 0.5;
        rock.castShadow = true;
        islandGroup.add(rock);
    }

    scene.add(islandGroup);
}

function createPalmTree() {
    palmTree = new THREE.Group();

    // Trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 6, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 3;
    trunk.castShadow = true;
    palmTree.add(trunk);

    // Palm fronds
    for (let i = 0; i < 6; i++) {
        const frondGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 4);
        const frondMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const frond = new THREE.Mesh(frondGeometry, frondMaterial);
        
        frond.position.y = 6;
        frond.rotation.z = Math.PI / 6;
        frond.rotation.y = (i / 6) * Math.PI * 2;
        frond.castShadow = true;
        palmTree.add(frond);
    }

    palmTree.position.set(4, 0, -3);
    scene.add(palmTree);
}

function createText() {
    const loader = new THREE.FontLoader();
    
    // Using a fallback approach since loading external fonts can be tricky
    // Create text using TextGeometry with built-in font
    const textGeometry = new THREE.TextGeometry('Loose Fridays', {
        font: undefined, // Will use default
        size: 2,
        height: 0.5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 5
    });

    // Fallback: Create text using 3D boxes if TextGeometry fails
    createTextFromBoxes();
}

function createTextFromBoxes() {
    const textGroup = new THREE.Group();
    
    // Create "LOOSE FRIDAYS" using box geometries
    const letters = [
        // L
        { pos: [-8, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [-7.5, -1.25, 0], size: [1.5, 0.5, 0.5] },
        // O
        { pos: [-5.5, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [-4.5, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [-5, 1.25, 0], size: [1, 0.5, 0.5] },
        { pos: [-5, -1.25, 0], size: [1, 0.5, 0.5] },
        // O
        { pos: [-3, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [-2, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [-2.5, 1.25, 0], size: [1, 0.5, 0.5] },
        { pos: [-2.5, -1.25, 0], size: [1, 0.5, 0.5] },
        // S
        { pos: [-0.5, 1.25, 0], size: [1.5, 0.5, 0.5] },
        { pos: [-1.25, 0.5, 0], size: [0.5, 1, 0.5] },
        { pos: [-0.5, 0, 0], size: [1.5, 0.5, 0.5] },
        { pos: [0.25, -0.5, 0], size: [0.5, 1, 0.5] },
        { pos: [-0.5, -1.25, 0], size: [1.5, 0.5, 0.5] },
        // E
        { pos: [1.5, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [2.25, 1.25, 0], size: [1.5, 0.5, 0.5] },
        { pos: [2.25, 0, 0], size: [1, 0.5, 0.5] },
        { pos: [2.25, -1.25, 0], size: [1.5, 0.5, 0.5] },
        
        // Space
        
        // F (FRIDAYS)
        { pos: [4.5, -3, 0], size: [0.5, 3, 0.5] },
        { pos: [5.25, -1.75, 0], size: [1.5, 0.5, 0.5] },
        { pos: [5.25, -2.5, 0], size: [1, 0.5, 0.5] },
        { pos: [5.25, -3.75, 0], size: [1.5, 0.5, 0.5] },
        // R
        { pos: [6.5, -3, 0], size: [0.5, 3, 0.5] },
        { pos: [7.25, -1.75, 0], size: [1.5, 0.5, 0.5] },
        { pos: [8, -2.25, 0], size: [0.5, 1, 0.5] },
        { pos: [7.25, -2.5, 0], size: [1, 0.5, 0.5] },
        { pos: [7.75, -3.25, 0], size: [0.5, 1, 0.5] },
        // I
        { pos: [9, -3, 0], size: [0.5, 3, 0.5] },
        { pos: [9, -1.75, 0], size: [1.5, 0.5, 0.5] },
        { pos: [9, -4.25, 0], size: [1.5, 0.5, 0.5] }
    ];

    const textMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xFFD700,
        emissive: 0x222200
    });

    letters.forEach(letter => {
        const geometry = new THREE.BoxGeometry(letter.size[0], letter.size[1], letter.size[2]);
        const mesh = new THREE.Mesh(geometry, textMaterial);
        mesh.position.set(letter.pos[0], letter.pos[1], letter.pos[2]);
        mesh.castShadow = true;
        textGroup.add(mesh);
    });

    // Position the text group
    textGroup.position.set(0, 8, 0);
    textGroup.rotation.x = -0.1;
    textMesh = textGroup;
    scene.add(textGroup);

    // Create text shadow on the sand
    createTextShadow();
}

function createTextShadow() {
    const shadowGeometry = new THREE.PlaneGeometry(20, 6);
    const shadowMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000,
        transparent: true,
        opacity: 0.3
    });
    
    textShadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    textShadow.rotation.x = -Math.PI / 2;
    textShadow.position.set(0, 0.1, 2);
    scene.add(textShadow);
}

function animate() {
    animationId = requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Update ocean waves
    if (oceanMesh) {
        oceanMesh.material.uniforms.time.value = time;
    }

    // Text hovering/waving effect
    if (textMesh) {
        textMesh.position.y = 8 + Math.sin(time * 2) * 0.5;
        textMesh.rotation.y = Math.sin(time * 0.5) * 0.1;
        textMesh.rotation.z = Math.sin(time * 1.5) * 0.05;
    }

    // Palm tree swaying
    if (palmTree) {
        palmTree.rotation.z = Math.sin(time * 2) * 0.05;
    }

    // Update shadow position based on text
    if (textShadow && textMesh) {
        textShadow.position.x = textMesh.position.x * 0.1;
        textShadow.position.z = 2 + textMesh.position.y * 0.1;
    }

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

// Start the application
init();