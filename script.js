// Three.js Scene Setup
let scene, camera, renderer, controls;
let textMesh, islandGroup, oceanMesh;
let palmTree, floatingLetters, crab;
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
    createFloatingLetters();
    createCrab();
    
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
    const oceanGeometry = new THREE.PlaneGeometry(200, 200, 150, 150);
    const oceanMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            deepColor: { value: new THREE.Color(0x003366) },
            shallowColor: { value: new THREE.Color(0x0099CC) },
            foamColor: { value: new THREE.Color(0xFFFFFF) },
            waveHeight: { value: 3.0 },
            waveSpeed: { value: 1.0 }
        },
        vertexShader: `
            uniform float time;
            uniform float waveHeight;
            uniform float waveSpeed;
            varying vec2 vUv;
            varying float vWave;
            varying vec3 vPosition;
            
            void main() {
                vUv = uv;
                vec3 pos = position;
                
                // Multiple wave layers for realistic ocean
                float wave1 = sin(pos.x * 0.02 + time * waveSpeed * 2.0) * waveHeight * 0.5;
                float wave2 = sin(pos.y * 0.03 + time * waveSpeed * 1.5) * waveHeight * 0.3;
                float wave3 = sin((pos.x + pos.y) * 0.015 + time * waveSpeed * 2.5) * waveHeight * 0.4;
                float wave4 = sin(pos.x * 0.08 + time * waveSpeed * 4.0) * waveHeight * 0.1;
                float wave5 = sin(pos.y * 0.12 + time * waveSpeed * 3.0) * waveHeight * 0.15;
                
                vWave = (wave1 + wave2 + wave3 + wave4 + wave5) * 0.3;
                pos.z = vWave;
                vPosition = pos;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 deepColor;
            uniform vec3 shallowColor;
            uniform vec3 foamColor;
            uniform float time;
            varying vec2 vUv;
            varying float vWave;
            varying vec3 vPosition;
            
            void main() {
                // Wave-based color mixing
                float waveStrength = (vWave + 3.0) * 0.2;
                vec3 baseColor = mix(deepColor, shallowColor, waveStrength);
                
                // Add foam on wave peaks
                float foam = smoothstep(1.5, 2.0, vWave);
                vec3 color = mix(baseColor, foamColor, foam * 0.6);
                
                // Add subtle texture variation
                float noise = sin(vPosition.x * 10.0 + time) * sin(vPosition.y * 8.0 + time * 1.5) * 0.05;
                color += noise;
                
                gl_FragColor = vec4(color, 0.85);
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

    // Create more realistic island shape using noise
    const islandGeometry = new THREE.CylinderGeometry(8, 12, 3, 32);
    const vertices = islandGeometry.attributes.position.array;
    
    // Add variation to island shape
    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const z = vertices[i + 2];
        const distance = Math.sqrt(x * x + z * z);
        const noise = Math.sin(distance * 0.5) * Math.cos(x * 0.3) * Math.sin(z * 0.4) * 0.3;
        vertices[i + 1] += noise;
    }
    islandGeometry.attributes.position.needsUpdate = true;
    islandGeometry.computeVertexNormals();

    const islandMaterial = new THREE.MeshLambertMaterial({ color: 0xF4E4BC });
    const island = new THREE.Mesh(islandGeometry, islandMaterial);
    island.position.y = -1;
    island.receiveShadow = true;
    island.castShadow = true;
    islandGroup.add(island);

    // Add more varied rocks and coral
    for (let i = 0; i < 12; i++) {
        const rockSize = Math.random() * 0.8 + 0.3;
        const rockGeometry = new THREE.SphereGeometry(rockSize, 8, 6);
        const isCoralRock = Math.random() > 0.6;
        const rockMaterial = new THREE.MeshLambertMaterial({ 
            color: isCoralRock ? 0xFF6B6B : 0x8B7D6B 
        });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        
        const angle = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const radius = 9 + Math.random() * 4;
        rock.position.x = Math.cos(angle) * radius;
        rock.position.z = Math.sin(angle) * radius;
        rock.position.y = -1.8 + Math.random() * 0.8;
        rock.scale.setScalar(0.5 + Math.random() * 0.5);
        rock.castShadow = true;
        islandGroup.add(rock);
    }

    // Add some beach plants
    for (let i = 0; i < 8; i++) {
        const plantGeometry = new THREE.ConeGeometry(0.2, 0.8, 4);
        const plantMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 });
        const plant = new THREE.Mesh(plantGeometry, plantMaterial);
        
        const angle = Math.random() * Math.PI * 2;
        const radius = 5 + Math.random() * 3;
        plant.position.x = Math.cos(angle) * radius;
        plant.position.z = Math.sin(angle) * radius;
        plant.position.y = 0.2;
        plant.castShadow = true;
        islandGroup.add(plant);
    }

    scene.add(islandGroup);
}

function createPalmTree() {
    palmTree = new THREE.Group();

    // More realistic curved trunk
    const trunkSegments = 8;
    for (let i = 0; i < trunkSegments; i++) {
        const segmentGeometry = new THREE.CylinderGeometry(
            0.35 - i * 0.02, 
            0.4 - i * 0.02, 
            0.8, 
            8
        );
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const segment = new THREE.Mesh(segmentGeometry, trunkMaterial);
        
        segment.position.y = i * 0.7 + 0.4;
        segment.position.x = Math.sin(i * 0.3) * 0.3;
        segment.rotation.z = Math.sin(i * 0.5) * 0.1;
        segment.castShadow = true;
        palmTree.add(segment);
    }

    // Better palm fronds using planes
    for (let i = 0; i < 8; i++) {
        const frondGeometry = new THREE.PlaneGeometry(0.3, 4);
        const frondMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x228B22,
            side: THREE.DoubleSide
        });
        const frond = new THREE.Mesh(frondGeometry, frondMaterial);
        
        frond.position.y = 6;
        frond.position.x = Math.sin(i * 0.3) * 0.3;
        frond.rotation.z = Math.PI / 3 + Math.sin(i * 0.5) * 0.2;
        frond.rotation.y = (i / 8) * Math.PI * 2;
        frond.castShadow = true;
        palmTree.add(frond);
    }

    // Add coconuts
    for (let i = 0; i < 4; i++) {
        const coconutGeometry = new THREE.SphereGeometry(0.15, 8, 6);
        const coconutMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const coconut = new THREE.Mesh(coconutGeometry, coconutMaterial);
        
        const angle = (i / 4) * Math.PI * 2;
        coconut.position.x = Math.cos(angle) * 0.4 + Math.sin(i * 0.3) * 0.3;
        coconut.position.y = 5.5 + Math.sin(i) * 0.3;
        coconut.position.z = Math.sin(angle) * 0.4;
        coconut.castShadow = true;
        palmTree.add(coconut);
    }

    palmTree.position.set(4, 0, -3);
    scene.add(palmTree);
}

function createText() {
    const loader = new THREE.FontLoader();
    
    // Using a fallback approach since loading external fonts can be tricky
    // Create text using TextGeometry with built-in font
    const textGeometry = new THREE.TextGeometry('Loose Friday', {
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
    
    // Create "LOOSE FRIDAY" using box geometries - Fixed and complete
    const letters = [
        // L
        { pos: [-12, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [-11.25, -1.25, 0], size: [1.5, 0.5, 0.5] },
        
        // O
        { pos: [-9.5, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [-8.5, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [-9, 1.25, 0], size: [1, 0.5, 0.5] },
        { pos: [-9, -1.25, 0], size: [1, 0.5, 0.5] },
        
        // O
        { pos: [-7, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [-6, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [-6.5, 1.25, 0], size: [1, 0.5, 0.5] },
        { pos: [-6.5, -1.25, 0], size: [1, 0.5, 0.5] },
        
        // S
        { pos: [-4.5, 1.25, 0], size: [1.5, 0.5, 0.5] },
        { pos: [-5.25, 0.5, 0], size: [0.5, 1, 0.5] },
        { pos: [-4.5, 0, 0], size: [1.5, 0.5, 0.5] },
        { pos: [-3.75, -0.5, 0], size: [0.5, 1, 0.5] },
        { pos: [-4.5, -1.25, 0], size: [1.5, 0.5, 0.5] },
        
        // E
        { pos: [-2.5, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [-1.75, 1.25, 0], size: [1.5, 0.5, 0.5] },
        { pos: [-1.75, 0, 0], size: [1, 0.5, 0.5] },
        { pos: [-1.75, -1.25, 0], size: [1.5, 0.5, 0.5] },
        
        // Space between LOOSE and FRIDAY
        
        // F
        { pos: [1, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [1.75, 1.25, 0], size: [1.5, 0.5, 0.5] },
        { pos: [1.75, 0.25, 0], size: [1.2, 0.5, 0.5] },
        
        // R
        { pos: [3.5, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [4.25, 1.25, 0], size: [1.2, 0.5, 0.5] },
        { pos: [5.2, 0.75, 0], size: [0.5, 1, 0.5] },
        { pos: [4.25, 0.25, 0], size: [1, 0.5, 0.5] },
        { pos: [4.75, -0.5, 0], size: [0.5, 1, 0.5] },
        { pos: [5.2, -1.25, 0], size: [0.5, 0.5, 0.5] },
        
        // I
        { pos: [6.5, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [6.5, 1.25, 0], size: [1.5, 0.5, 0.5] },
        { pos: [6.5, -1.25, 0], size: [1.5, 0.5, 0.5] },
        
        // D
        { pos: [8.5, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [9.25, 1.25, 0], size: [1, 0.5, 0.5] },
        { pos: [9.25, -1.25, 0], size: [1, 0.5, 0.5] },
        { pos: [9.75, 0.5, 0], size: [0.5, 1.5, 0.5] },
        { pos: [9.75, -0.5, 0], size: [0.5, 1.5, 0.5] },
        
        // A
        { pos: [11.5, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [12.5, 0, 0], size: [0.5, 3, 0.5] },
        { pos: [12, 1.25, 0], size: [1, 0.5, 0.5] },
        { pos: [12, 0.25, 0], size: [1, 0.5, 0.5] },
        
        // Y
        { pos: [14, 0.75, 0], size: [0.5, 1.5, 0.5] },
        { pos: [15, 0.75, 0], size: [0.5, 1.5, 0.5] },
        { pos: [14.5, 0, 0], size: [0.5, 1.5, 0.5] },
        { pos: [14.5, -1, 0], size: [0.5, 1, 0.5] }
    ];

    const textMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xFFD700,
        emissive: 0x333300
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
}

function createFloatingLetters() {
    floatingLetters = new THREE.Group();
    
    // Create "LORDE SUMMER" using smaller box geometries floating in water
    const waterLetters = [
        // L
        { pos: [-20, 0, 15], size: [0.3, 2, 0.3] },
        { pos: [-19.5, -0.85, 15], size: [1, 0.3, 0.3] },
        
        // O
        { pos: [-17.5, 0, 15], size: [0.3, 2, 0.3] },
        { pos: [-16.5, 0, 15], size: [0.3, 2, 0.3] },
        { pos: [-17, 0.85, 15], size: [0.7, 0.3, 0.3] },
        { pos: [-17, -0.85, 15], size: [0.7, 0.3, 0.3] },
        
        // R
        { pos: [-15, 0, 15], size: [0.3, 2, 0.3] },
        { pos: [-14.25, 0.85, 15], size: [0.8, 0.3, 0.3] },
        { pos: [-13.7, 0.425, 15], size: [0.3, 0.6, 0.3] },
        { pos: [-14.25, 0.15, 15], size: [0.7, 0.3, 0.3] },
        { pos: [-14.5, -0.35, 15], size: [0.3, 0.7, 0.3] },
        
        // D
        { pos: [-12, 0, 15], size: [0.3, 2, 0.3] },
        { pos: [-11.25, 0.85, 15], size: [0.7, 0.3, 0.3] },
        { pos: [-11.25, -0.85, 15], size: [0.7, 0.3, 0.3] },
        { pos: [-10.75, 0.35, 15], size: [0.3, 1, 0.3] },
        { pos: [-10.75, -0.35, 15], size: [0.3, 1, 0.3] },
        
        // E
        { pos: [-9, 0, 15], size: [0.3, 2, 0.3] },
        { pos: [-8.25, 0.85, 15], size: [1, 0.3, 0.3] },
        { pos: [-8.25, 0, 15], size: [0.7, 0.3, 0.3] },
        { pos: [-8.25, -0.85, 15], size: [1, 0.3, 0.3] },
        
        // Space
        
        // S (SUMMER)
        { pos: [-5, 0.85, 15], size: [1, 0.3, 0.3] },
        { pos: [-5.75, 0.35, 15], size: [0.3, 0.7, 0.3] },
        { pos: [-5, 0, 15], size: [1, 0.3, 0.3] },
        { pos: [-4.25, -0.35, 15], size: [0.3, 0.7, 0.3] },
        { pos: [-5, -0.85, 15], size: [1, 0.3, 0.3] },
        
        // U
        { pos: [-2.5, 0.35, 15], size: [0.3, 1.3, 0.3] },
        { pos: [-1.5, 0.35, 15], size: [0.3, 1.3, 0.3] },
        { pos: [-2, -0.85, 15], size: [0.7, 0.3, 0.3] },
        
        // M
        { pos: [0, 0, 15], size: [0.3, 2, 0.3] },
        { pos: [1.5, 0, 15], size: [0.3, 2, 0.3] },
        { pos: [0.75, 0.5, 15], size: [0.3, 1, 0.3] },
        { pos: [0.4, 0.7, 15], size: [0.3, 0.6, 0.3] },
        { pos: [1.1, 0.7, 15], size: [0.3, 0.6, 0.3] },
        
        // M
        { pos: [2.5, 0, 15], size: [0.3, 2, 0.3] },
        { pos: [4, 0, 15], size: [0.3, 2, 0.3] },
        { pos: [3.25, 0.5, 15], size: [0.3, 1, 0.3] },
        { pos: [2.9, 0.7, 15], size: [0.3, 0.6, 0.3] },
        { pos: [3.6, 0.7, 15], size: [0.3, 0.6, 0.3] },
        
        // E
        { pos: [5.5, 0, 15], size: [0.3, 2, 0.3] },
        { pos: [6.25, 0.85, 15], size: [1, 0.3, 0.3] },
        { pos: [6.25, 0, 15], size: [0.7, 0.3, 0.3] },
        { pos: [6.25, -0.85, 15], size: [1, 0.3, 0.3] },
        
        // R
        { pos: [8, 0, 15], size: [0.3, 2, 0.3] },
        { pos: [8.75, 0.85, 15], size: [0.8, 0.3, 0.3] },
        { pos: [9.3, 0.425, 15], size: [0.3, 0.6, 0.3] },
        { pos: [8.75, 0.15, 15], size: [0.7, 0.3, 0.3] },
        { pos: [9, -0.35, 15], size: [0.3, 0.7, 0.3] }
    ];

    const waterTextMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x00CCFF,
        emissive: 0x003366,
        transparent: true,
        opacity: 0.9
    });

    waterLetters.forEach(letter => {
        const geometry = new THREE.BoxGeometry(letter.size[0], letter.size[1], letter.size[2]);
        const mesh = new THREE.Mesh(geometry, waterTextMaterial);
        mesh.position.set(letter.pos[0], letter.pos[1], letter.pos[2]);
        mesh.castShadow = true;
        floatingLetters.add(mesh);
    });

    // Position the floating letters in the water
    floatingLetters.position.set(0, -1, 0);
    scene.add(floatingLetters);
}

function createCrab() {
    crab = new THREE.Group();

    // Crab body
    const bodyGeometry = new THREE.SphereGeometry(0.3, 8, 6);
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xFF4500 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.scale.set(1.2, 0.6, 1);
    body.position.y = 0.2;
    body.castShadow = true;
    crab.add(body);

    // Crab claws
    const clawGeometry = new THREE.SphereGeometry(0.15, 6, 4);
    const clawMaterial = new THREE.MeshLambertMaterial({ color: 0xFF6347 });
    
    const leftClaw = new THREE.Mesh(clawGeometry, clawMaterial);
    leftClaw.position.set(-0.5, 0.2, -0.2);
    leftClaw.castShadow = true;
    crab.add(leftClaw);
    
    const rightClaw = new THREE.Mesh(clawGeometry, clawMaterial);
    rightClaw.position.set(0.5, 0.2, -0.2);
    rightClaw.castShadow = true;
    crab.add(rightClaw);

    // Crab legs
    const legGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.3, 4);
    const legMaterial = new THREE.MeshLambertMaterial({ color: 0xFF4500 });
    
    for (let i = 0; i < 6; i++) {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        const side = i < 3 ? -1 : 1;
        const legIndex = i % 3;
        leg.position.set(side * 0.4, 0.05, -0.3 + legIndex * 0.3);
        leg.rotation.z = side * Math.PI * 0.2;
        leg.castShadow = true;
        crab.add(leg);
    }

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.05, 6, 4);
    const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 0.35, 0.25);
    crab.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 0.35, 0.25);
    crab.add(rightEye);

    // Position crab on island
    crab.position.set(-2, 0, 2);
    crab.userData = { 
        angle: 0, 
        radius: 3,
        speed: 0.5
    };
    scene.add(crab);
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

    // Floating letters animation
    if (floatingLetters) {
        floatingLetters.children.forEach((letter, index) => {
            letter.position.y = -1 + Math.sin(time * 1.5 + index * 0.3) * 0.3;
            letter.rotation.x = Math.sin(time + index * 0.5) * 0.1;
            letter.rotation.z = Math.cos(time * 0.8 + index * 0.4) * 0.05;
        });
    }

    // Palm tree swaying with coconuts
    if (palmTree) {
        palmTree.rotation.z = Math.sin(time * 2) * 0.05;
        palmTree.children.forEach((child, index) => {
            if (child.geometry && child.geometry.type === 'SphereGeometry') {
                // Animate coconuts slightly
                child.rotation.y = time * 0.5 + index;
            }
        });
    }

    // Animate crab movement
    if (crab) {
        crab.userData.angle += crab.userData.speed * 0.01;
        const newX = Math.cos(crab.userData.angle) * crab.userData.radius;
        const newZ = Math.sin(crab.userData.angle) * crab.userData.radius;
        crab.position.x = newX;
        crab.position.z = newZ;
        
        // Rotate crab to face movement direction
        crab.rotation.y = crab.userData.angle + Math.PI / 2;
        
        // Add some bobbing motion
        crab.position.y = 0.1 + Math.sin(time * 4) * 0.05;
        
        // Animate claws
        crab.children.forEach((child, index) => {
            if (index === 1 || index === 2) { // Claws
                child.rotation.z = Math.sin(time * 3 + index * Math.PI) * 0.3;
            }
        });
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